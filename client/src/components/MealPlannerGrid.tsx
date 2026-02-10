import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Sparkles } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";

export interface MealSlot {
  day: number;
  mealType: "breakfast" | "lunch" | "dinner";
  recipeName?: string;
  recipeId?: string;
}

interface MealPlannerGridProps {
  meals: MealSlot[];
  onAddMeal?: (day: number, mealType: "breakfast" | "lunch" | "dinner") => void;
  onRemoveMeal?: (day: number, mealType: "breakfast" | "lunch" | "dinner") => void;
  onAISuggest?: (day: number, mealType: "breakfast" | "lunch" | "dinner") => void;
}

export function MealPlannerGrid({ meals, onAddMeal, onRemoveMeal, onAISuggest }: MealPlannerGridProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const mealTypes = ["breakfast", "lunch", "dinner"] as const;

  const getMeal = (dayIndex: number, mealType: string) => {
    return meals.find((m) => m.day === dayIndex && m.mealType === mealType);
  };

  return (
    <Card data-testid="meal-planner-grid">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
          <span>Weekly Meal Plan</span>
          <Button variant="outline" size="sm" data-testid="button-ai-plan">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Plan Week
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2">
              <div className="p-2" />
              {days.map((day, i) => (
                <div
                  key={i}
                  className="p-2 text-center font-medium text-sm"
                >
                  <p>{format(day, "EEE")}</p>
                  <p className="text-muted-foreground">{format(day, "MMM d")}</p>
                </div>
              ))}
              {mealTypes.map((mealType) => (
                <>
                  <div
                    key={mealType}
                    className="p-2 font-medium text-sm capitalize flex items-center"
                  >
                    {mealType}
                  </div>
                  {days.map((_, dayIndex) => {
                    const meal = getMeal(dayIndex, mealType);
                    return (
                      <div
                        key={`${dayIndex}-${mealType}`}
                        className="p-1"
                        data-testid={`meal-slot-${dayIndex}-${mealType}`}
                      >
                        {meal?.recipeName ? (
                          <div className="p-2 bg-primary/10 rounded-md text-sm relative group">
                            <p className="font-medium truncate pr-5">{meal.recipeName}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onRemoveMeal?.(dayIndex, mealType)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-md p-2 flex flex-col items-center justify-center gap-1 min-h-[60px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onAddMeal?.(dayIndex, mealType)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
