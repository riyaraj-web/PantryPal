import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChefHat, X } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { getFoodImage } from "@/lib/food-images";

export interface ExpiringItem {
  id: string;
  name: string;
  expiryDate: Date;
  quantity: number;
  unit: string;
}

interface ExpiryAlertPanelProps {
  items: ExpiringItem[];
  onDismiss?: (id: string) => void;
  onUseInRecipe?: (item: ExpiringItem) => void;
}

export function ExpiryAlertPanel({ items, onDismiss, onUseInRecipe }: ExpiryAlertPanelProps) {
  if (items.length === 0) {
    return null;
  }

  const sortedItems = [...items].sort(
    (a, b) => a.expiryDate.getTime() - b.expiryDate.getTime()
  );

  return (
    <Card className="border-amber-500/50" data-testid="expiry-alert-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Expiring Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedItems.map((item) => {
          const daysLeft = differenceInDays(item.expiryDate, new Date());
          const isExpired = daysLeft < 0;
          const imageUrl = getFoodImage(item.name);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted"
              data-testid={`expiring-item-${item.id}`}
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} {item.unit} -{" "}
                  <span className={isExpired ? "text-destructive" : "text-amber-500"}>
                    {isExpired
                      ? "Expired"
                      : daysLeft === 0
                      ? "Today"
                      : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUseInRecipe?.(item)}
                  data-testid={`button-use-recipe-${item.id}`}
                >
                  <ChefHat className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDismiss?.(item.id)}
                  data-testid={`button-dismiss-${item.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
