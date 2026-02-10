import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { authMiddleware, generateToken, type AuthRequest } from "./auth";

const pantryItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string(),
  category: z.string(),
  expiryDate: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().optional(),
});

const shoppingItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string(),
  category: z.string(),
  purchased: z.boolean().default(false),
});

const mealPlanSchema = z.object({
  date: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  recipeName: z.string(),
  recipeId: z.string().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ message: "Username and password required" });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters" });
        return;
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }

      const user = await storage.createUser({ username, password });
      const token = generateToken(user.id);

      res.status(201).json({
        user: { id: user.id, username: user.username },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username and password required" });
        return;
      }

      const user = await storage.validateUser(username, password);
      if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      const token = generateToken(user.id);

      res.json({
        user: { id: user.id, username: user.username },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
  
  // Pantry Items Routes (Protected)
  app.get("/api/pantry", async (_req, res) => {
    try {
      const items = await storage.getAllPantryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pantry items" });
    }
  });

  app.post("/api/pantry", async (req, res) => {
    try {
      const data = pantryItemSchema.parse(req.body);
      const item = await storage.createPantryItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create pantry item" });
      }
    }
  });

  app.put("/api/pantry/:id", async (req, res) => {
    try {
      const data = pantryItemSchema.partial().parse(req.body);
      const item = await storage.updatePantryItem(req.params.id, data);
      if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update pantry item" });
      }
    }
  });

  app.delete("/api/pantry/:id", async (req, res) => {
    try {
      const success = await storage.deletePantryItem(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pantry item" });
    }
  });

  // Shopping List Routes
  app.get("/api/shopping", async (_req, res) => {
    try {
      const items = await storage.getAllShoppingItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shopping items" });
    }
  });

  app.post("/api/shopping", async (req, res) => {
    try {
      const data = shoppingItemSchema.parse(req.body);
      const item = await storage.createShoppingItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create shopping item" });
      }
    }
  });

  app.put("/api/shopping/:id", async (req, res) => {
    try {
      const data = shoppingItemSchema.partial().parse(req.body);
      const item = await storage.updateShoppingItem(req.params.id, data);
      if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update shopping item" });
      }
    }
  });

  app.delete("/api/shopping/:id", async (req, res) => {
    try {
      const success = await storage.deleteShoppingItem(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shopping item" });
    }
  });

  // Meal Plan Routes
  app.get("/api/meals", async (_req, res) => {
    try {
      const meals = await storage.getAllMealPlans();
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  app.post("/api/meals", async (req, res) => {
    try {
      const data = mealPlanSchema.parse(req.body);
      const meal = await storage.createMealPlan(data);
      res.status(201).json(meal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create meal plan" });
      }
    }
  });

  app.delete("/api/meals/:id", async (req, res) => {
    try {
      const success = await storage.deleteMealPlan(req.params.id);
      if (!success) {
        res.status(404).json({ message: "Meal plan not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meal plan" });
    }
  });

  // Budget/Expenses Routes
  app.get("/api/expenses", async (_req, res) => {
    try {
      const expenses = await storage.getAllExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expense = await storage.createExpense(req.body);
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  // Statistics/Dashboard Routes
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/expiring-soon", async (_req, res) => {
    try {
      const items = await storage.getExpiringSoonItems(7);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expiring items" });
    }
  });

  return httpServer;
}
