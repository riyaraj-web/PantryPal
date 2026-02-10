import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { getFoodImage } from "@/lib/food-images";

export interface PantryItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  imageUrl?: string;
}

interface PantryItemProps {
  item: PantryItemData;
  onEdit?: (item: PantryItemData) => void;
  onDelete?: (id: string) => void;
  onAddToList?: (item: PantryItemData) => void;
}

export function PantryItem({ item, onEdit, onDelete, onAddToList }: PantryItemProps) {
  const daysUntilExpiry = differenceInDays(item.expiryDate, new Date());
  const imageUrl = item.imageUrl || getFoodImage(item.name);

  const getExpiryStatus = () => {
    if (daysUntilExpiry < 0) return { color: "bg-destructive", text: "Expired" };
    if (daysUntilExpiry <= 3) return { color: "bg-destructive", text: `${daysUntilExpiry}d left` };
    if (daysUntilExpiry <= 7) return { color: "bg-amber-500", text: `${daysUntilExpiry}d left` };
    return { color: "bg-primary", text: format(item.expiryDate, "MMM d") };
  };

  const status = getExpiryStatus();

  const categoryColors: Record<string, string> = {
    Dairy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Produce: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Meat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Grains: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Beverages: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Frozen: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    Snacks: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Condiments: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <Card className="hover-elevate" data-testid={`pantry-item-${item.id}`}>
      <CardContent className="p-4">
        <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-md mb-3 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-4"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-base truncate">{item.name}</h3>
              <Badge
                variant="secondary"
                className={`mt-1 text-xs ${categoryColors[item.category] || ""}`}
              >
                {item.category}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              <span className="text-sm text-muted-foreground">{status.text}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
            <span className="text-lg font-medium">
              {item.quantity} {item.unit}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddToList?.(item)}
                data-testid={`button-add-to-list-${item.id}`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(item)}
                data-testid={`button-edit-${item.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(item.id)}
                data-testid={`button-delete-${item.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
