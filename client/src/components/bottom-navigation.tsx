import { Link, useLocation } from "wouter";
import { Home, Utensils, Dumbbell, TrendingUp, Menu } from "lucide-react";

const navigationItems = [
  { path: "/", icon: Home, label: "Dashboard", testId: "nav-dashboard" },
  { path: "/nutrition", icon: Utensils, label: "Nutrition", testId: "nav-nutrition" },
  { path: "/workouts", icon: Dumbbell, label: "Workouts", testId: "nav-workouts" },
  { path: "/progress", icon: TrendingUp, label: "Progress", testId: "nav-progress" },
  { path: "/more", icon: Menu, label: "More", testId: "nav-more" },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border px-4 py-3 z-40">
      <div className="flex items-center justify-around">
        {navigationItems.map(({ path, icon: Icon, label, testId }) => {
          const isActive = location === path;
          
          return (
            <Link key={path} href={path}>
              <button 
                className={`flex flex-col items-center space-y-1 tab-transition ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={testId}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
