import { useQuery } from "@tanstack/react-query";

export function useFitnessData(userId: string) {
  return useQuery({
    queryKey: ["/api/users", userId, "dashboard"],
    enabled: !!userId,
  });
}

export function useUserMetrics(userId: string) {
  return useQuery({
    queryKey: ["/api/users", userId, "metrics"],
    enabled: !!userId,
  });
}

export function useRecentWorkouts(userId: string, limit = 5) {
  return useQuery({
    queryKey: ["/api/users", userId, "workouts", { limit }],
    enabled: !!userId,
  });
}

export function useTodaysMeals(userId: string) {
  return useQuery({
    queryKey: ["/api/users", userId, "logged-meals", "today"],
    enabled: !!userId,
  });
}
