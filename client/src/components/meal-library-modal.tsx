import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Coffee, UtensilsCrossed, Flame, Moon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MealOption } from "@shared/schema";

interface MealLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const categoryIcons = {
  "post-workout": Flame,
  "breakfast": Coffee,
  "lunch": UtensilsCrossed,
  "evening-snack": Coffee,
  "dinner": Moon,
};

const categoryLabels = {
  "post-workout": "Post-Workout (Within 45 mins)",
  "breakfast": "Breakfast (Around 9:00 AM)",
  "lunch": "Lunch (Around 1:00 PM)",
  "evening-snack": "Evening Snack (Around 4:30 PM)",
  "dinner": "Dinner (Around 8:00 PM)",
};

export function MealLibraryModal({ isOpen, onClose, userId }: MealLibraryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mealOptions = [], isLoading } = useQuery({
    queryKey: ["/api/meal-options"],
    enabled: isOpen,
  });

  const logMealMutation = useMutation({
    mutationFn: async (mealOption: MealOption) => {
      const loggedMealData = {
        mealOptionId: mealOption.id,
        customCalories: mealOption.calories,
        customProtein: mealOption.protein,
        mealType: mealOption.category === "post-workout" ? "snack" : mealOption.category,
      };
      
      return apiRequest("POST", `/api/users/${userId}/logged-meals`, loggedMealData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "logged-meals"] });
      toast({
        title: "Meal logged successfully! 🎉",
        description: "Your nutrition progress has been updated.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error logging meal",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredMeals = mealOptions.filter((meal: MealOption) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mealsByCategory = filteredMeals.reduce((acc: Record<string, MealOption[]>, meal: MealOption) => {
    if (!acc[meal.category]) {
      acc[meal.category] = [];
    }
    acc[meal.category].push(meal);
    return acc;
  }, {});

  const handleAddMeal = (meal: MealOption) => {
    logMealMutation.mutate(meal);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle>Meal Library</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted"
              data-testid="close-meal-library"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted border-none"
              data-testid="meal-search-input"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading meals...</div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {Object.entries(mealsByCategory).map(([category, meals]) => {
                const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                const categoryLabel = categoryLabels[category as keyof typeof categoryLabels];
                
                return (
                  <div key={category}>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      {IconComponent && <IconComponent className="w-5 h-5 text-primary mr-2" />}
                      {categoryLabel}
                    </h4>
                    <div className="space-y-2">
                      {meals.map((meal) => (
                        <div
                          key={meal.id}
                          className="bg-muted/30 rounded-xl p-3 flex justify-between items-center"
                          data-testid={`meal-option-${meal.id}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{meal.name}</p>
                            <p className="text-sm text-muted-foreground">{meal.description}</p>
                            <p className="text-xs text-primary">
                              {meal.calories} kcal • {meal.protein}g protein
                            </p>
                          </div>
                          <Button
                            onClick={() => handleAddMeal(meal)}
                            disabled={logMealMutation.isPending}
                            className="px-3 py-1 h-auto text-sm ml-3"
                            data-testid={`add-meal-${meal.id}`}
                          >
                            {logMealMutation.isPending ? "Adding..." : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
