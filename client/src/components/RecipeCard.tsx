import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, ChefHat, Users } from "lucide-react";
import { getRecipeImage } from "@/lib/food-images";

export interface RecipeData {
  id: string;
  title: string;
  imageUrl?: string;
  prepTime: number;
  servings: number;
  matchPercentage: number;
  missingIngredients: string[];
  tags?: string[];
}

interface RecipeCardProps {
  recipe: RecipeData;
  onCook?: (recipe: RecipeData) => void;
  onView?: (recipe: RecipeData) => void;
}

export function RecipeCard({ recipe, onCook, onView }: RecipeCardProps) {
  const imageUrl = recipe.imageUrl || getRecipeImage(recipe.title);
  
  return (
    <Card
      className="overflow-visible hover-elevate cursor-pointer"
      onClick={() => onView?.(recipe)}
      data-testid={`recipe-card-${recipe.id}`}
    >
      <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden rounded-t-md">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {recipe.matchPercentage}% match
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span>Ingredients available</span>
            <span className="font-medium">{recipe.matchPercentage}%</span>
          </div>
          <Progress value={recipe.matchPercentage} className="h-2" />
        </div>
        {recipe.missingIngredients.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
            Missing: {recipe.missingIngredients.join(", ")}
          </p>
        )}
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onCook?.(recipe);
          }}
          data-testid={`button-cook-${recipe.id}`}
        >
          Cook This
        </Button>
      </CardContent>
    </Card>
  );
}
