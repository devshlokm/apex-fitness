import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserMetricsSchema,
  insertMealOptionSchema,
  insertLoggedMealSchema,
  insertExerciseSchema,
  insertWorkoutSchema,
  insertWorkoutSetSchema,
  insertPersonalRecordSchema,
  insertDailyGoalsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id/streak", async (req, res) => {
    try {
      const { streak } = req.body;
      await storage.updateUserStreak(req.params.id, streak);
      res.json({ message: "Streak updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User metrics routes
  app.get("/api/users/:userId/metrics", async (req, res) => {
    try {
      const metrics = await storage.getUserMetrics(req.params.userId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/metrics/latest", async (req, res) => {
    try {
      const metrics = await storage.getLatestUserMetrics(req.params.userId);
      if (!metrics) {
        return res.status(404).json({ message: "No metrics found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/metrics", async (req, res) => {
    try {
      const metricsData = insertUserMetricsSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const metrics = await storage.createUserMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Invalid metrics data" });
    }
  });

  // Meal options routes
  app.get("/api/meal-options", async (req, res) => {
    try {
      const { category } = req.query;
      let meals;
      if (category) {
        meals = await storage.getMealOptionsByCategory(category as string);
      } else {
        meals = await storage.getMealOptions();
      }
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/meal-options", async (req, res) => {
    try {
      const mealData = insertMealOptionSchema.parse(req.body);
      const meal = await storage.createMealOption(mealData);
      res.status(201).json(meal);
    } catch (error) {
      res.status(400).json({ message: "Invalid meal data" });
    }
  });

  // Logged meals routes
  app.get("/api/users/:userId/logged-meals", async (req, res) => {
    try {
      const { date } = req.query;
      const meals = await storage.getLoggedMeals(req.params.userId, date as string);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/logged-meals/today", async (req, res) => {
    try {
      const meals = await storage.getTodaysLoggedMeals(req.params.userId);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/logged-meals", async (req, res) => {
    try {
      const mealData = insertLoggedMealSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const meal = await storage.createLoggedMeal(mealData);
      res.status(201).json(meal);
    } catch (error) {
      res.status(400).json({ message: "Invalid logged meal data" });
    }
  });

  // Exercises routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const { category } = req.query;
      let exercises;
      if (category) {
        exercises = await storage.getExercisesByCategory(category as string);
      } else {
        exercises = await storage.getExercises();
      }
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise data" });
    }
  });

  // Workouts routes
  app.get("/api/users/:userId/workouts", async (req, res) => {
    try {
      const { limit } = req.query;
      let workouts;
      if (limit) {
        workouts = await storage.getRecentWorkouts(req.params.userId, parseInt(limit as string));
      } else {
        workouts = await storage.getUserWorkouts(req.params.userId);
      }
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout data" });
    }
  });

  // Workout sets routes
  app.get("/api/workouts/:workoutId/sets", async (req, res) => {
    try {
      const sets = await storage.getWorkoutSets(req.params.workoutId);
      res.json(sets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workouts/:workoutId/sets", async (req, res) => {
    try {
      const setData = insertWorkoutSetSchema.parse({
        ...req.body,
        workoutId: req.params.workoutId
      });
      const set = await storage.createWorkoutSet(setData);
      res.status(201).json(set);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout set data" });
    }
  });

  // Personal records routes
  app.get("/api/users/:userId/personal-records", async (req, res) => {
    try {
      const { exerciseId } = req.query;
      if (exerciseId) {
        const pr = await storage.getPersonalRecord(req.params.userId, exerciseId as string);
        if (!pr) {
          return res.status(404).json({ message: "Personal record not found" });
        }
        res.json(pr);
      } else {
        const prs = await storage.getUserPersonalRecords(req.params.userId);
        res.json(prs);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/personal-records", async (req, res) => {
    try {
      const prData = insertPersonalRecordSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const pr = await storage.createPersonalRecord(prData);
      res.status(201).json(pr);
    } catch (error) {
      res.status(400).json({ message: "Invalid personal record data" });
    }
  });

  // Daily goals routes
  app.get("/api/users/:userId/daily-goals", async (req, res) => {
    try {
      const goals = await storage.getUserDailyGoals(req.params.userId);
      if (!goals) {
        return res.status(404).json({ message: "Daily goals not found" });
      }
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/daily-goals", async (req, res) => {
    try {
      const goalsData = insertDailyGoalsSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const goals = await storage.createDailyGoals(goalsData);
      res.status(201).json(goals);
    } catch (error) {
      res.status(400).json({ message: "Invalid daily goals data" });
    }
  });

  app.patch("/api/users/:userId/daily-goals", async (req, res) => {
    try {
      await storage.updateDailyGoals(req.params.userId, req.body);
      res.json({ message: "Daily goals updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard summary route
  app.get("/api/users/:userId/dashboard", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      const metrics = await storage.getLatestUserMetrics(req.params.userId);
      const todaysMeals = await storage.getTodaysLoggedMeals(req.params.userId);
      const recentWorkouts = await storage.getRecentWorkouts(req.params.userId, 2);
      const goals = await storage.getUserDailyGoals(req.params.userId);

      // Calculate daily progress
      const totalCalories = todaysMeals.reduce((sum, meal) => {
        return sum + (meal.customCalories || 0);
      }, 0);
      
      const totalProtein = todaysMeals.reduce((sum, meal) => {
        return sum + (meal.customProtein || 0);
      }, 0);

      const caloriesProgress = goals ? (totalCalories / (goals.targetCalories || 2300)) * 100 : 0;
      const proteinProgress = goals ? (totalProtein / (goals.targetProtein || 180)) * 100 : 0;

      res.json({
        user,
        metrics,
        todaysMeals,
        recentWorkouts,
        goals,
        progress: {
          calories: {
            consumed: totalCalories,
            target: goals?.targetCalories || 2300,
            percentage: Math.min(caloriesProgress, 100)
          },
          protein: {
            consumed: totalProtein,
            target: goals?.targetProtein || 180,
            percentage: Math.min(proteinProgress, 100)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
