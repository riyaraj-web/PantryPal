import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import { hashPassword, comparePassword } from "./auth";

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  barcode?: string;
  price?: number;
  addedDate: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  addedDate: string;
}

export interface MealPlan {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeName: string;
  recipeId?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
  
  getAllPantryItems(): Promise<PantryItem[]>;
  getPantryItem(id: string): Promise<PantryItem | undefined>;
  createPantryItem(item: Omit<PantryItem, "id" | "addedDate">): Promise<PantryItem>;
  updatePantryItem(id: string, item: Partial<Omit<PantryItem, "id">>): Promise<PantryItem | undefined>;
  deletePantryItem(id: string): Promise<boolean>;
  
  getAllShoppingItems(): Promise<ShoppingItem[]>;
  createShoppingItem(item: Omit<ShoppingItem, "id" | "addedDate">): Promise<ShoppingItem>;
  updateShoppingItem(id: string, item: Partial<Omit<ShoppingItem, "id">>): Promise<ShoppingItem | undefined>;
  deleteShoppingItem(id: string): Promise<boolean>;
  
  getAllMealPlans(): Promise<MealPlan[]>;
  createMealPlan(meal: Omit<MealPlan, "id">): Promise<MealPlan>;
  deleteMealPlan(id: string): Promise<boolean>;
  
  getAllExpenses(): Promise<Expense[]>;
  createExpense(expense: Omit<Expense, "id">): Promise<Expense>;
  
  getStats(): Promise<{
    totalItems: number;
    expiringSoon: number;
    plannedMeals: number;
    monthlySpending: number;
  }>;
  getExpiringSoonItems(days: number): Promise<PantryItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pantryItems: Map<string, PantryItem>;
  private shoppingItems: Map<string, ShoppingItem>;
  private mealPlans: Map<string, MealPlan>;
  private expenses: Map<string, Expense>;

  constructor() {
    this.users = new Map();
    this.pantryItems = new Map();
    this.shoppingItems = new Map();
    this.mealPlans = new Map();
    this.expenses = new Map();
    
    this.seedMockData();
  }

  private async seedMockData() {
    await this.createUser({ username: "demo", password: "demo123" });

    const mockPantryItems: PantryItem[] = [
      { id: randomUUID(), name: "Greek Yogurt", quantity: 500, unit: "g", category: "Dairy", expiryDate: addDays(new Date(), 1).toISOString(), price: 4.99, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Fresh Salmon", quantity: 300, unit: "g", category: "Protein", expiryDate: addDays(new Date(), 2).toISOString(), price: 12.99, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Avocados", quantity: 3, unit: "pcs", category: "Produce", expiryDate: addDays(new Date(), 3).toISOString(), price: 5.99, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Whole Wheat Bread", quantity: 1, unit: "loaf", category: "Bakery", expiryDate: addDays(new Date(), 5).toISOString(), price: 3.49, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Chicken", quantity: 800, unit: "g", category: "Protein", expiryDate: addDays(new Date(), 4).toISOString(), price: 9.99, addedDate: new Date().toISOString() },
    ];

    const mockShoppingItems: ShoppingItem[] = [
      { id: randomUUID(), name: "Milk", quantity: 2, unit: "L", category: "Dairy", purchased: false, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Eggs", quantity: 12, unit: "pcs", category: "Dairy", purchased: false, addedDate: new Date().toISOString() },
      { id: randomUUID(), name: "Tomatoes", quantity: 6, unit: "pcs", category: "Produce", purchased: true, addedDate: new Date().toISOString() },
    ];

    const mockMealPlans: MealPlan[] = [
      { id: randomUUID(), date: new Date().toISOString(), mealType: "dinner", recipeName: "Salmon with Avocado" },
      { id: randomUUID(), date: addDays(new Date(), 1).toISOString(), mealType: "breakfast", recipeName: "Greek Yogurt Parfait" },
    ];

    const mockExpenses: Expense[] = [
      { id: randomUUID(), amount: 45.67, category: "Groceries", date: new Date().toISOString(), description: "Weekly shopping" },
      { id: randomUUID(), amount: 23.45, category: "Groceries", date: addDays(new Date(), -3).toISOString(), description: "Fresh produce" },
    ];

    mockPantryItems.forEach(item => this.pantryItems.set(item.id, item));
    mockShoppingItems.forEach(item => this.shoppingItems.set(item.id, item));
    mockMealPlans.forEach(meal => this.mealPlans.set(meal.id, meal));
    mockExpenses.forEach(expense => this.expenses.set(expense.id, expense));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await hashPassword(insertUser.password);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await comparePassword(password, user.password);
    return isValid ? user : null;
  }

  async getAllPantryItems(): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values());
  }

  async getPantryItem(id: string): Promise<PantryItem | undefined> {
    return this.pantryItems.get(id);
  }

  async createPantryItem(item: Omit<PantryItem, "id" | "addedDate">): Promise<PantryItem> {
    const id = randomUUID();
    const newItem: PantryItem = { ...item, id, addedDate: new Date().toISOString() };
    this.pantryItems.set(id, newItem);
    return newItem;
  }

  async updatePantryItem(id: string, updates: Partial<Omit<PantryItem, "id">>): Promise<PantryItem | undefined> {
    const item = this.pantryItems.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...updates };
    this.pantryItems.set(id, updated);
    return updated;
  }

  async deletePantryItem(id: string): Promise<boolean> {
    return this.pantryItems.delete(id);
  }

  async getAllShoppingItems(): Promise<ShoppingItem[]> {
    return Array.from(this.shoppingItems.values());
  }

  async createShoppingItem(item: Omit<ShoppingItem, "id" | "addedDate">): Promise<ShoppingItem> {
    const id = randomUUID();
    const newItem: ShoppingItem = { ...item, id, addedDate: new Date().toISOString() };
    this.shoppingItems.set(id, newItem);
    return newItem;
  }

  async updateShoppingItem(id: string, updates: Partial<Omit<ShoppingItem, "id">>): Promise<ShoppingItem | undefined> {
    const item = this.shoppingItems.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...updates };
    this.shoppingItems.set(id, updated);
    return updated;
  }

  async deleteShoppingItem(id: string): Promise<boolean> {
    return this.shoppingItems.delete(id);
  }

  async getAllMealPlans(): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values());
  }

  async createMealPlan(meal: Omit<MealPlan, "id">): Promise<MealPlan> {
    const id = randomUUID();
    const newMeal: MealPlan = { ...meal, id };
    this.mealPlans.set(id, newMeal);
    return newMeal;
  }

  async deleteMealPlan(id: string): Promise<boolean> {
    return this.mealPlans.delete(id);
  }

  async getAllExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async createExpense(expense: Omit<Expense, "id">): Promise<Expense> {
    const id = randomUUID();
    const newExpense: Expense = { ...expense, id };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  async getStats() {
    const items = await this.getAllPantryItems();
    const expiringSoon = await this.getExpiringSoonItems(7);
    const meals = await this.getAllMealPlans();
    const expenses = await this.getAllExpenses();
    
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyExpenses = expenses.filter(e => new Date(e.date) >= monthStart);
    const monthlySpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      totalItems: items.length,
      expiringSoon: expiringSoon.length,
      plannedMeals: meals.length,
      monthlySpending,
    };
  }

  async getExpiringSoonItems(days: number): Promise<PantryItem[]> {
    const items = await this.getAllPantryItems();
    const cutoffDate = addDays(new Date(), days);
    
    return items.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= cutoffDate && expiryDate >= new Date();
    });
  }
}

export const storage = new MemStorage();
