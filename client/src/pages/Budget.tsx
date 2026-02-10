import { BudgetChart, type BudgetData } from "@/components/BudgetChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, TrendingDown, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const mockBudgetData: BudgetData = {
  monthlyBudget: 500,
  currentSpending: 342.5,
  categoryBreakdown: [
    { category: "Produce", amount: 89.5, color: "#22c55e" },
    { category: "Dairy", amount: 65.2, color: "#3b82f6" },
    { category: "Meat", amount: 98.8, color: "#ef4444" },
    { category: "Grains", amount: 45.0, color: "#f59e0b" },
    { category: "Beverages", amount: 44.0, color: "#8b5cf6" },
  ],
  monthlyTrend: [
    { month: "Jul", amount: 410 },
    { month: "Aug", amount: 380 },
    { month: "Sep", amount: 450 },
    { month: "Oct", amount: 395 },
    { month: "Nov", amount: 420 },
    { month: "Dec", amount: 342.5 },
  ],
};

const mockTopItems = [
  { name: "Organic Chicken", amount: 45.99, trend: "up" as const },
  { name: "Fresh Salmon", amount: 38.5, trend: "up" as const },
  { name: "Cheese Selection", amount: 32.0, trend: "down" as const },
  { name: "Vegetables Mix", amount: 28.75, trend: "down" as const },
  { name: "Specialty Coffee", amount: 24.0, trend: "up" as const },
];

export default function Budget() {
  const [budget, setBudget] = useState(mockBudgetData.monthlyBudget.toString());
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Budget</h1>
          <p className="text-muted-foreground">Track your grocery spending</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" data-testid="button-budget-settings">
              <Settings className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Monthly Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget Amount ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  data-testid="input-budget-amount"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)} data-testid="button-save-budget">
                Save Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <BudgetChart data={mockBudgetData} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Spending Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTopItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium w-6">{i + 1}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${item.amount.toFixed(2)}</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
