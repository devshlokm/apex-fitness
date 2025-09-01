import { useState } from "react";
import { User, Bell, Target, Download, HelpCircle, Info, ChevronRight, LogOut, Settings, Shield, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useFitnessData } from "@/hooks/use-fitness-data";

const userId = "user-1"; // In a real app, this would come from auth

export default function More() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const { data: dashboardData } = useFitnessData(userId);
  const { user } = dashboardData || {} as any;

  const handleToggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      {/* Header */}
      <header className="bg-card px-4 pt-12 pb-6 shadow-sm border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">More</h1>
        <p className="text-muted-foreground">Settings and account options</p>
      </header>

      <main className="px-4 py-6 pb-24 space-y-6">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Info */}
            <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
              <img 
                src={user?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"} 
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-primary"
                data-testid="profile-picture"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground" data-testid="profile-username">
                  {user?.username || "Alex"}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="profile-email">
                  {user?.email || "alex@fitness.app"}
                </p>
                <p className="text-xs text-primary" data-testid="profile-streak">
                  {user?.currentStreak || 0} day streak 🔥
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Account Actions */}
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
                data-testid="edit-profile-button"
              >
                <span className="flex items-center">
                  <Settings className="w-4 h-4 mr-3" />
                  Edit Profile
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
                data-testid="privacy-settings-button"
              >
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-3" />
                  Privacy & Security
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle app theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleToggleDarkMode}
                data-testid="dark-mode-toggle"
              />
            </div>

            {/* Notification Settings */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4" />
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get reminded to log meals</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="notifications-toggle"
              />
            </div>

            {/* Weekly Reports */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4" />
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive progress summaries</p>
                </div>
              </div>
              <Switch
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
                data-testid="weekly-reports-toggle"
              />
            </div>

            <Separator />

            {/* Goals Setting */}
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="daily-goals-button"
            >
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-3" />
                Daily Goals
              </span>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">2300 cal • 180g protein</p>
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </div>
            </Button>

            {/* Units Setting */}
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="units-button"
            >
              <span className="flex items-center">
                <Settings className="w-4 h-4 mr-3" />
                Units
              </span>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Metric (kg, cm)</p>
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="export-data-button"
            >
              <span className="flex items-center">
                <Download className="w-4 h-4 mr-3" />
                Export My Data
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="backup-restore-button"
            >
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-3" />
                Backup & Restore
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Support & Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Support & Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="help-center-button"
            >
              <span className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help Center
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto p-3 bg-muted/30 rounded-lg"
              data-testid="about-button"
            >
              <span className="flex items-center">
                <Info className="w-4 h-4 mr-3" />
                About FitTracker
              </span>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">v1.0.0</p>
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </div>
            </Button>

            <Separator />

            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
              data-testid="sign-out-button"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary" data-testid="total-meals-logged">
                  {(dashboardData as any)?.todaysMeals?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Meals Today</p>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <p className="text-2xl font-bold text-accent" data-testid="total-workouts-week">
                  {(dashboardData as any)?.recentWorkouts?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Workouts This Week</p>
              </div>
              <div className="text-center p-3 bg-secondary/10 rounded-lg">
                <p className="text-2xl font-bold text-secondary" data-testid="current-streak">
                  {user?.currentStreak || 0}
                </p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success" data-testid="total-weight-lost">
                  2.1kg
                </p>
                <p className="text-xs text-muted-foreground">Weight Lost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}