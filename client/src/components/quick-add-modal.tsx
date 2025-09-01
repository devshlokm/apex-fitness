import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Utensils, Dumbbell, Weight } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: () => void;
  onLogWorkout: () => void;
  onUpdateMetrics: () => void;
}

export function QuickAddModal({
  isOpen,
  onClose,
  onLogMeal,
  onLogWorkout,
  onUpdateMetrics
}: QuickAddModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bottom-0 top-auto transform-none rounded-t-3xl p-6 data-[state=open]:slide-in-from-bottom-full">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6"></div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Add</h3>
        
        <div className="space-y-3">
          <Button
            onClick={onLogMeal}
            className="w-full bg-primary/10 text-primary hover:bg-primary/20 rounded-xl p-4 h-auto justify-start"
            variant="ghost"
            data-testid="quick-add-meal"
          >
            <Utensils className="mr-3" />
            <span className="font-medium">Log Meal</span>
          </Button>
          
          <Button
            onClick={onLogWorkout}
            className="w-full bg-accent/10 text-accent hover:bg-accent/20 rounded-xl p-4 h-auto justify-start"
            variant="ghost"
            data-testid="quick-add-workout"
          >
            <Dumbbell className="mr-3" />
            <span className="font-medium">Log Workout</span>
          </Button>
          
          <Button
            onClick={onUpdateMetrics}
            className="w-full bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl p-4 h-auto justify-start"
            variant="ghost"
            data-testid="quick-add-metrics"
          >
            <Weight className="mr-3" />
            <span className="font-medium">Update Body Metrics</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
