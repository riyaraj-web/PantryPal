import { useState } from "react";
import { RecipeCard, type RecipeData } from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Sparkles, Clock, Users, Check, ShoppingCart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const mockRecipes: RecipeData[] = [
  { id: "1", title: "Creamy Garlic Pasta", prepTime: 25, servings: 4, matchPercentage: 85, missingIngredients: ["Parmesan cheese"], tags: ["Italian", "Quick"] },
  { id: "2", title: "Grilled Chicken Salad", prepTime: 20, servings: 2, matchPercentage: 100, missingIngredients: [], tags: ["Healthy", "Low-carb"] },
  { id: "3", title: "Vegetable Stir Fry", prepTime: 15, servings: 3, matchPercentage: 70, missingIngredients: ["Soy sauce", "Sesame oil"], tags: ["Asian", "Vegetarian"] },
  { id: "4", title: "Salmon with Lemon Butter", prepTime: 30, servings: 2, matchPercentage: 90, missingIngredients: ["Capers"], tags: ["Seafood", "Keto"] },
  { id: "5", title: "Greek Yogurt Parfait", prepTime: 5, servings: 1, matchPercentage: 100, missingIngredients: [], tags: ["Breakfast", "Quick"] },
  { id: "6", title: "Beef Tacos", prepTime: 35, servings: 4, matchPercentage: 65, missingIngredients: ["Taco shells", "Salsa"], tags: ["Mexican", "Family"] },
];

const mockRecipeDetails = {
  title: "Creamy Garlic Pasta",
  prepTime: 25,
  servings: 4,
  ingredients: [
    { name: "Pasta", amount: "400g", available: true },
    { name: "Heavy Cream", amount: "250ml", available: true },
    { name: "Garlic", amount: "4 cloves", available: true },
    { name: "Butter", amount: "2 tbsp", available: true },
    { name: "Parmesan cheese", amount: "100g", available: false },
    { name: "Salt & Pepper", amount: "to taste", available: true },
  ],
  instructions: [
    "Cook pasta according to package directions. Reserve 1 cup pasta water.",
    "Mince garlic and saut\u00e9 in butter over medium heat until fragrant.",
    "Add heavy cream and simmer for 5 minutes.",
    "Toss in cooked pasta, adding pasta water as needed.",
    "Season with salt and pepper. Top with Parmesan.",
  ],
};

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredRecipes = mockRecipes
    .filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAvailable = !showOnlyAvailable || recipe.matchPercentage === 100;
      return matchesSearch && matchesAvailable;
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Recipes</h1>
          <p className="text-muted-foreground">Find recipes based on your ingredients</p>
        </div>
        <Button data-testid="button-ai-suggest-recipes">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Suggestions
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-recipes"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={showOnlyAvailable}
            onCheckedChange={(checked) => setShowOnlyAvailable(checked as boolean)}
            data-testid="checkbox-available-only"
          />
          <label htmlFor="available" className="text-sm cursor-pointer">
            Only show recipes I can make now
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onCook={(r) => setSelectedRecipe(r)}
            onView={(r) => setSelectedRecipe(r)}
          />
        ))}
      </div>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{mockRecipeDetails.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mockRecipeDetails.prepTime} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {mockRecipeDetails.servings} servings
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="space-y-2">
                {mockRecipeDetails.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {ing.available ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={!ing.available ? "text-muted-foreground" : ""}>
                        {ing.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ol className="space-y-3">
                {mockRecipeDetails.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-semibold text-primary">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" data-testid="button-start-cooking">
                Start Cooking
              </Button>
              <Button variant="outline" data-testid="button-add-missing">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add Missing to List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
