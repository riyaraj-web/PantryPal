import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { ExpiryAlertPanel, type ExpiringItem } from "@/components/ExpiryAlertPanel";
import { RecipeCard, type RecipeData } from "@/components/RecipeCard";
import { AIChatPanel } from "@/components/AIChatPanel";
import { Package, AlertTriangle, Calendar, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const mockExpiringItems: ExpiringItem[] = [
  { id: "1", name: "Greek Yogurt", expiryDate: addDays(new Date(), 1), quantity: 500, unit: "g" },
  { id: "2", name: "Fresh Salmon", expiryDate: addDays(new Date(), 2), quantity: 300, unit: "g" },
  { id: "3", name: "Avocados", expiryDate: addDays(new Date(), 3), quantity: 3, unit: "pcs" },
];

const mockSuggestedRecipes: RecipeData[] = [
  { id: "1", title: "Salmon with Avocado", prepTime: 25, servings: 2, matchPercentage: 95, missingIngredients: [] },
  { id: "2", title: "Greek Yogurt Parfait", prepTime: 10, servings: 1, matchPercentage: 100, missingIngredients: [] },
];

export default function Dashboard() {
  const [expiringItems, setExpiringItems] = useState(mockExpiringItems);

  const handleDismissExpiry = (id: string) => {
    setExpiringItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: 'url(/dashboard-bg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50/50 via-background/80 to-emerald-50/50" />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="relative">
          <Card className="border-none shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="h-8 w-8" />
                    Welcome Back!
                  </h1>
                  <p className="text-green-50 text-lg">Here's your pantry overview for today</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Package className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Items"
            value={47}
            subtitle="In your pantry"
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Expiring Soon"
            value={expiringItems.length}
            subtitle="Within 7 days"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="This Week's Meals"
            value={12}
            subtitle="Planned meals"
            icon={Calendar}
          />
          <StatCard
            title="Monthly Spending"
            value="$342"
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Quick Actions */}
        <Card className="border-green-200 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">Quick Insights</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Most Stocked</p>
                  <p className="text-xs text-muted-foreground">Dairy Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Needs Attention</p>
                  <p className="text-xs text-muted-foreground">3 items expiring</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">This Week</p>
                  <p className="text-xs text-muted-foreground">12 meals planned</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpiryAlertPanel
              items={expiringItems}
              onDismiss={handleDismissExpiry}
              onUseInRecipe={(item) => console.log("Use in recipe:", item.name)}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Suggested Recipes</h2>
                  <p className="text-sm text-muted-foreground">Based on items expiring soon</p>
                </div>
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSuggestedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onCook={(r) => console.log("Cook:", r.title)}
                    onView={(r) => console.log("View:", r.title)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-[500px]">
            <AIChatPanel onSendMessage={(msg) => console.log("AI message:", msg)} />
          </div>
        </div>
      </div>
    </div>
  );
}
