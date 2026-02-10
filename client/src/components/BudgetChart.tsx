import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export interface BudgetData {
  monthlyBudget: number;
  currentSpending: number;
  categoryBreakdown: Array<{ category: string; amount: number; color: string }>;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

interface BudgetChartProps {
  data: BudgetData;
}

export function BudgetChart({ data }: BudgetChartProps) {
  const budgetPercentage = Math.min(
    (data.currentSpending / data.monthlyBudget) * 100,
    100
  );
  const isOverBudget = data.currentSpending > data.monthlyBudget;

  return (
    <div className="space-y-6" data-testid="budget-chart">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-3xl font-semibold">
                  ${data.currentSpending.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  of ${data.monthlyBudget.toFixed(2)} budget
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-medium ${
                    isOverBudget ? "text-destructive" : "text-primary"
                  }`}
                >
                  {isOverBudget ? "Over budget" : `$${(data.monthlyBudget - data.currentSpending).toFixed(2)} left`}
                </p>
              </div>
            </div>
            <Progress
              value={budgetPercentage}
              className={`h-3 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {data.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm">{cat.category}</span>
                  </div>
                  <span className="text-sm font-medium">${cat.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
