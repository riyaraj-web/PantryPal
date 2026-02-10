import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChefHat,
  Calendar,
  DollarSign,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/pantry", label: "Pantry", icon: Package },
  { path: "/shopping", label: "Shopping", icon: ShoppingCart },
  { path: "/recipes", label: "Recipes", icon: ChefHat },
  { path: "/meals", label: "Meals", icon: Calendar },
  { path: "/budget", label: "Budget", icon: DollarSign },
];

export function NavigationTabs() {
  const [location] = useLocation();

  return (
    <nav
      className="border-b bg-card sticky top-[73px] z-40"
      data-testid="navigation-tabs"
    >
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex items-center gap-1 p-2 min-w-max">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={isActive ? "bg-secondary" : ""}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
