import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({ isVisible, onComplete }: SuccessAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Main success icon */}
      <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center celebration-animation">
        <Check className="w-8 h-8" />
      </div>
      
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: i % 3 === 0 ? '#4CAF50' : i % 3 === 1 ? '#FF6B35' : '#2196F3',
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Success text */}
      <div className="absolute mt-32 text-center">
        <p className="text-primary font-semibold text-lg animate-pulse">
          Great job! 🎉
        </p>
      </div>
    </div>
  );
}
