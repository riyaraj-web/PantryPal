import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { useState } from "react";

import Dashboard from "@/pages/Dashboard";
import Pantry from "@/pages/Pantry";
import ShoppingList from "@/pages/ShoppingList";
import Recipes from "@/pages/Recipes";
import MealPlanner from "@/pages/MealPlanner";
import Budget from "@/pages/Budget";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/pantry">
        {() => <ProtectedRoute component={Pantry} />}
      </Route>
      <Route path="/shopping">
        {() => <ProtectedRoute component={ShoppingList} />}
      </Route>
      <Route path="/recipes">
        {() => <ProtectedRoute component={Recipes} />}
      </Route>
      <Route path="/meals">
        {() => <ProtectedRoute component={MealPlanner} />}
      </Route>
      <Route path="/budget">
        {() => <ProtectedRoute component={Budget} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && (
        <>
          <Header
            onScanClick={() => setScannerOpen(true)}
            notificationCount={3}
            username={user?.username}
            onLogout={logout}
          />
          <NavigationTabs />
        </>
      )}
      <main>
        <Router />
      </main>
      {isAuthenticated && (
        <BarcodeScannerModal
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onBarcodeScanned={(barcode) => {
            console.log("Scanned barcode:", barcode);
            setScannerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
