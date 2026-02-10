import { useState } from "react";
import { MealPlannerGrid, type MealSlot } from "@/components/MealPlannerGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, Sparkles } from "lucide-react";

const mockMeals: MealSlot[] = [
  { day: 0, mealType: "breakfast", recipeName: "Oatmeal Bowl", recipeId: "1" },
  { day: 0, mealType: "dinner", recipeName: "Pasta Primavera", recipeId: "2" },
  { day: 1, mealType: "lunch", recipeName: "Caesar Salad", recipeId: "3" },
  { day: 2, mealType: "breakfast", recipeName: "Avocado Toast", recipeId: "4" },
  { day: 2, mealType: "dinner", recipeName: "Grilled Salmon", recipeId: "5" },
  { day: 3, mealType: "lunch", recipeName: "Chicken Wrap", recipeId: "6" },
  { day: 4, mealType: "dinner", recipeName: "Stir Fry", recipeId: "7" },
  { day: 5, mealType: "breakfast", recipeName: "Pancakes", recipeId: "8" },
  { day: 6, mealType: "dinner", recipeName: "Sunday Roast", recipeId: "9" },
];

const mockNutritionSummary = {
  avgCalories: 1850,
  avgProtein: 75,
  avgCarbs: 220,
  avgFat: 65,
};

export default function MealPlanner() {
  const [meals, setMeals] = useState(mockMeals);

  const handleRemoveMeal = (day: number, mealType: "breakfast" | "lunch" | "dinner") => {
    setMeals((prev) => prev.filter((m) => !(m.day === day && m.mealType === mealType)));
  };

  const totalMeals = meals.length;
  const daysPlanned = new Set(meals.map((m) => m.day)).size;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Meal Planner</h1>
          <p className="text-muted-foreground">Plan your meals for the week</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" data-testid="button-generate-list">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate List
          </Button>
          <Button variant="outline" data-testid="button-export-plan">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MealPlannerGrid
            meals={meals}
            onAddMeal={(day, type) => console.log("Add meal:", day, type)}
            onRemoveMeal={handleRemoveMeal}
            onAISuggest={(day, type) => console.log("AI suggest:", day, type)}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Week Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meals planned</span>
                <span className="font-medium">{totalMeals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days covered</span>
                <span className="font-medium">{daysPlanned}/7</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avg. Daily Nutrition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{mockNutritionSummary.avgCalories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{mockNutritionSummary.avgProtein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-medium">{mockNutritionSummary.avgCarbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fat</span>
                <span className="font-medium">{mockNutritionSummary.avgFat}g</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" data-testid="button-ai-plan-meals">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Plan My Week
          </Button>
        </div>
      </div>
    </div>
  );
}
