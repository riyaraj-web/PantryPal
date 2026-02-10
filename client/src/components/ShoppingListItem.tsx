import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { getFoodImage } from "@/lib/food-images";

export interface ShoppingListItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  isChecked: boolean;
}

interface ShoppingListItemProps {
  item: ShoppingListItemData;
  onToggle?: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
}

export function ShoppingListItem({ item, onToggle, onDelete }: ShoppingListItemProps) {
  const [isChecked, setIsChecked] = useState(item.isChecked);
  const imageUrl = getFoodImage(item.name);

  const handleToggle = (checked: boolean) => {
    setIsChecked(checked);
    onToggle?.(item.id, checked);
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-md border bg-card hover-elevate ${
        isChecked ? "opacity-60" : ""
      }`}
      data-testid={`shopping-item-${item.id}`}
    >
      <div className="text-muted-foreground cursor-grab">
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleToggle}
        data-testid={`checkbox-${item.id}`}
      />
      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-contain p-1"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isChecked ? "line-through" : ""}`}>
          {item.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.quantity} {item.unit}
        </p>
      </div>
      {item.estimatedPrice && (
        <span className="text-sm font-medium text-muted-foreground">
          ${item.estimatedPrice.toFixed(2)}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete?.(item.id)}
        data-testid={`button-delete-shopping-${item.id}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
