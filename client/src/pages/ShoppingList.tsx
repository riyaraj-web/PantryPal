import { useState } from "react";
import { ShoppingListItem, type ShoppingListItemData } from "@/components/ShoppingListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockShoppingItems: ShoppingListItemData[] = [
  { id: "1", name: "Whole Milk", category: "Dairy", quantity: 2, unit: "L", estimatedPrice: 5.99, isChecked: false },
  { id: "2", name: "Eggs (dozen)", category: "Dairy", quantity: 1, unit: "pack", estimatedPrice: 4.49, isChecked: true },
  { id: "3", name: "Organic Apples", category: "Produce", quantity: 6, unit: "pcs", estimatedPrice: 8.99, isChecked: false },
  { id: "4", name: "Chicken Thighs", category: "Meat", quantity: 1, unit: "kg", estimatedPrice: 12.99, isChecked: false },
  { id: "5", name: "Olive Oil", category: "Condiments", quantity: 1, unit: "bottle", estimatedPrice: 9.99, isChecked: false },
  { id: "6", name: "Pasta", category: "Grains", quantity: 2, unit: "pack", estimatedPrice: 3.98, isChecked: true },
];

const mockSuggestions = [
  { name: "Butter", reason: "Running low" },
  { name: "Bread", reason: "Weekly staple" },
  { name: "Bananas", reason: "You buy often" },
];

export default function ShoppingList() {
  const [items, setItems] = useState(mockShoppingItems);
  const [newItemName, setNewItemName] = useState("");

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItemData[]>);

  const totalEstimated = items
    .filter((i) => !i.isChecked)
    .reduce((sum, i) => sum + (i.estimatedPrice || 0), 0);

  const handleToggle = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: checked } : item))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingListItemData = {
      id: Date.now().toString(),
      name: newItemName,
      category: "Other",
      quantity: 1,
      unit: "pcs",
      isChecked: false,
    };
    setItems((prev) => [newItem, ...prev]);
    setNewItemName("");
  };

  const handleClearChecked = () => {
    setItems((prev) => prev.filter((item) => !item.isChecked));
  };

  const handleAddSuggestion = (name: string) => {
    const newItem: ShoppingListItemData = {
      id: Date.now().toString(),
      name,
      category: "Other",
      quantity: 1,
      unit: "pcs",
      isChecked: false,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Shopping List</h1>
              <p className="text-muted-foreground">{items.filter((i) => !i.isChecked).length} items to buy</p>
            </div>
            <Button variant="outline" onClick={handleClearChecked} data-testid="button-clear-checked">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Checked
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add an item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              data-testid="input-add-shopping-item"
            />
            <Button onClick={handleAddItem} data-testid="button-add-shopping-item">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">{category}</h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <ShoppingListItem
                      key={item.id}
                      item={item}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estimated Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">${totalEstimated.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {items.filter((i) => !i.isChecked).length} items remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSuggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted"
                >
                  <div>
                    <p className="font-medium">{suggestion.name}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddSuggestion(suggestion.name)}
                    data-testid={`button-add-suggestion-${i}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
