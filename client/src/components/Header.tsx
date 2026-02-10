import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Scan, Bell, Search, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onScanClick?: () => void;
  notificationCount?: number;
  username?: string;
  onLogout?: () => void;
}

export function Header({ onScanClick, notificationCount = 0, username, onLogout }: HeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-50" data-testid="header">
      <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">PantryPal</span>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, recipes..."
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onScanClick} data-testid="button-scan-header">
            <Scan className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Scan</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>
                <span className="text-amber-500 mr-2">Milk expires tomorrow</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-amber-500 mr-2">3 items expiring this week</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Shopping list has 5 items</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {username && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {username}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
