import { useState } from "react";
import { format } from "date-fns";
import { Bell, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { BottomNavigation } from "@/components/bottom-navigation";
import { QuickAddModal } from "@/components/quick-add-modal";
import { MealLibraryModal } from "@/components/meal-library-modal";
import { SuccessAnimation } from "@/components/success-animation";
import { useFitnessData } from "@/hooks/use-fitness-data";

const userId = "user-1"; // In a real app, this would come from auth

export default function Dashboard() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: dashboardData, isLoading } = useFitnessData(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const {
    user,
    metrics,
    todaysMeals = [],
    recentWorkouts = [],
    progress = { calories: { consumed: 0, target: 2300, percentage: 0 }, protein: { consumed: 0, target: 180, percentage: 0 } }
  } = dashboardData || {};

  const handleLogMeal = () => {
    setShowQuickAdd(false);
    setShowMealLibrary(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
  };

  const mealTypeLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner",
    snack: "Snack"
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative overflow-hidden">
      {/* Header with User Info */}
      <header className="bg-card px-4 pt-12 pb-6 shadow-sm border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={user?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"} 
                alt="User profile" 
                className="w-12 h-12 rounded-full border-2 border-primary"
                data-testid="user-profile-image"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="user-welcome">
                Welcome back, {user?.username || "Alex"}!
              </h1>
              <p className="text-sm text-muted-foreground flex items-center" data-testid="user-streak">
                <span className="streak-fire mr-1">🔥</span>
                {user?.currentStreak || 0} day streak
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-muted relative"
            data-testid="notifications-button"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </Button>
        </div>
        
        {/* Daily Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-primary font-medium">Weight</p>
            <p className="text-lg font-bold text-primary" data-testid="weight-display">
              {metrics?.weight || 82.7}kg
            </p>
            <p className="text-xs text-muted-foreground flex items-center justify-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -0.3kg
            </p>
          </div>
          <div className="bg-accent/10 rounded-lg p-3 text-center">
            <p className="text-xs text-accent font-medium">Workouts</p>
            <p className="text-lg font-bold text-accent" data-testid="workouts-display">
              {recentWorkouts.length}/6
            </p>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-secondary font-medium">Protein</p>
            <p className="text-lg font-bold text-secondary" data-testid="protein-display">
              {Math.round(progress.protein.percentage)}%
            </p>
            <p className="text-xs text-muted-foreground">Goal hit</p>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <section className="px-4 py-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Today's Progress</h2>
          <span className="text-sm text-muted-foreground" data-testid="current-date">
            {format(new Date(), "MMMM d, yyyy")}
          </span>
        </div>

        {/* Circular Progress Indicators */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <CircularProgress
              percentage={progress.calories.percentage}
              color="hsl(122, 40%, 49%)"
              size={80}
            >
              <span className="text-sm font-bold text-foreground" data-testid="calories-percentage">
                {Math.round(progress.calories.percentage)}%
              </span>
            </CircularProgress>
            <p className="text-xs text-muted-foreground mt-2">Calories</p>
            <p className="text-sm font-semibold text-foreground" data-testid="calories-progress">
              {progress.calories.consumed} / {progress.calories.target}
            </p>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <CircularProgress
              percentage={progress.protein.percentage}
              color="hsl(19, 91%, 60%)"
              size={80}
            >
              <span className="text-sm font-bold text-foreground" data-testid="protein-percentage">
                {Math.round(progress.protein.percentage)}%
              </span>
            </CircularProgress>
            <p className="text-xs text-muted-foreground mt-2">Protein</p>
            <p className="text-sm font-semibold text-foreground" data-testid="protein-progress">
              {Math.round(progress.protein.consumed)}g / {progress.protein.target}g
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setShowMealLibrary(true)}
            className="bg-primary text-primary-foreground rounded-xl p-4 h-auto flex items-center justify-center space-x-2 smooth-transition hover:bg-primary/90"
            data-testid="log-meal-button"
          >
            <span className="font-medium">Log Meal</span>
          </Button>
          <Button
            className="bg-accent text-accent-foreground rounded-xl p-4 h-auto flex items-center justify-center space-x-2 smooth-transition hover:bg-accent/90"
            data-testid="log-workout-button"
          >
            <span className="font-medium">Log Workout</span>
          </Button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="px-4 py-2 space-y-6 pb-24">
        {/* Today's Meals Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Today's Meals</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {todaysMeals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No meals logged today</p>
                  <Button
                    onClick={() => setShowMealLibrary(true)}
                    className="mt-2"
                    size="sm"
                    data-testid="log-first-meal"
                  >
                    Log your first meal
                  </Button>
                </div>
              ) : (
                todaysMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground" data-testid={`meal-name-${index}`}>
                        {meal.customMealName || "Custom Meal"}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`meal-details-${index}`}>
                        {meal.customCalories} cal • {meal.customProtein}g protein
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mealTypeLabels[meal.mealType as keyof typeof mealTypeLabels]}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Logged
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Workouts</h3>
              <Button variant="ghost" size="sm" className="text-accent">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentWorkouts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent workouts</p>
                <Button className="mt-2" size="sm" data-testid="log-first-workout">
                  Log your first workout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={workout.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground" data-testid={`workout-name-${index}`}>
                          {workout.name}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`workout-time-${index}`}>
                          {format(new Date(workout.date), "MMM d")} • {workout.duration || 45} minutes
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Body Metrics Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Body Metrics</h3>
              <Button variant="ghost" size="sm" className="text-secondary">
                Update
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-lg font-bold text-foreground" data-testid="metrics-weight">
                  {metrics?.weight || 82.7}kg
                </p>
                <p className="text-xs text-primary flex items-center justify-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.3kg this week
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Body Fat</p>
                <p className="text-lg font-bold text-foreground" data-testid="metrics-body-fat">
                  {metrics?.bodyFat || 22.9}%
                </p>
                <p className="text-xs text-secondary flex items-center justify-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.5% this month
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Muscle Rate</p>
                <p className="text-lg font-bold text-foreground" data-testid="metrics-muscle-rate">
                  {metrics?.muscleRate || 72.2}%
                </p>
                <p className="text-xs text-primary flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +1.2% this month
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="text-lg font-bold text-foreground" data-testid="metrics-bmi">
                  {metrics?.bmi || 24.7}
                </p>
                <p className="text-xs text-muted-foreground">Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg smooth-transition hover:scale-110"
        data-testid="floating-add-button"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Modals */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onLogMeal={handleLogMeal}
        onLogWorkout={() => setShowQuickAdd(false)}
        onUpdateMetrics={() => setShowQuickAdd(false)}
      />

      <MealLibraryModal
        isOpen={showMealLibrary}
        onClose={() => setShowMealLibrary(false)}
        userId={userId}
      />

      <SuccessAnimation
        isVisible={showSuccess}
        onComplete={handleSuccessComplete}
      />
    </div>
  );
}
