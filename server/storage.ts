import { 
  type User, type InsertUser,
  type UserMetrics, type InsertUserMetrics,
  type MealOption, type InsertMealOption,
  type LoggedMeal, type InsertLoggedMeal,
  type Exercise, type InsertExercise,
  type Workout, type InsertWorkout,
  type WorkoutSet, type InsertWorkoutSet,
  type PersonalRecord, type InsertPersonalRecord,
  type DailyGoals, type InsertDailyGoals
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<void>;

  // User metrics
  getUserMetrics(userId: string): Promise<UserMetrics[]>;
  getLatestUserMetrics(userId: string): Promise<UserMetrics | undefined>;
  createUserMetrics(metrics: InsertUserMetrics): Promise<UserMetrics>;

  // Meal options
  getMealOptions(): Promise<MealOption[]>;
  getMealOptionsByCategory(category: string): Promise<MealOption[]>;
  createMealOption(meal: InsertMealOption): Promise<MealOption>;

  // Logged meals
  getLoggedMeals(userId: string, date?: string): Promise<LoggedMeal[]>;
  createLoggedMeal(meal: InsertLoggedMeal): Promise<LoggedMeal>;
  getTodaysLoggedMeals(userId: string): Promise<LoggedMeal[]>;

  // Exercises
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workouts
  getUserWorkouts(userId: string): Promise<Workout[]>;
  getRecentWorkouts(userId: string, limit: number): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;

  // Workout sets
  getWorkoutSets(workoutId: string): Promise<WorkoutSet[]>;
  createWorkoutSet(set: InsertWorkoutSet): Promise<WorkoutSet>;

  // Personal records
  getUserPersonalRecords(userId: string): Promise<PersonalRecord[]>;
  getPersonalRecord(userId: string, exerciseId: string): Promise<PersonalRecord | undefined>;
  createPersonalRecord(pr: InsertPersonalRecord): Promise<PersonalRecord>;

  // Daily goals
  getUserDailyGoals(userId: string): Promise<DailyGoals | undefined>;
  createDailyGoals(goals: InsertDailyGoals): Promise<DailyGoals>;
  updateDailyGoals(userId: string, goals: Partial<InsertDailyGoals>): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private userMetrics: Map<string, UserMetrics[]> = new Map();
  private mealOptions: Map<string, MealOption> = new Map();
  private loggedMeals: Map<string, LoggedMeal[]> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private workouts: Map<string, Workout[]> = new Map();
  private workoutSets: Map<string, WorkoutSet[]> = new Map();
  private personalRecords: Map<string, PersonalRecord[]> = new Map();
  private dailyGoals: Map<string, DailyGoals> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: "user-1",
      username: "alex",
      email: "alex@fitness.app",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      currentStreak: 7,
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);

    // Initialize diet chart meal options
    this.initializeDietChartMeals();
    
    // Initialize exercises
    this.initializeExercises();

    // Create sample user metrics based on the screenshot
    const metrics: UserMetrics = {
      id: "metrics-1",
      userId: "user-1",
      date: new Date(),
      weight: 82.7,
      bmi: 24.7,
      bodyFat: 22.9,
      muscleRate: 72.2,
      fatFreeBodyWeight: 63.8,
      subcutaneousFat: 15.5,
      visceralFat: 6.4,
      bodyWater: 52.4,
      skeletalMuscle: 53.0,
      muscleMass: 59.7,
      boneMass: 3.3,
      protein: 20.7,
      bmr: 1848,
      bodyAge: 24
    };
    this.userMetrics.set("user-1", [metrics]);

    // Create default daily goals
    const goals: DailyGoals = {
      id: "goals-1",
      userId: "user-1",
      targetCalories: 2300,
      targetProtein: 180,
      targetWorkouts: 6
    };
    this.dailyGoals.set("user-1", goals);
  }

  private initializeDietChartMeals() {
    const mealOptionsData: Omit<MealOption, 'id'>[] = [
      // Post-Workout Meals
      { category: "post-workout", name: "The Standard", description: "1 Scoop Whey + 1 Large Banana", calories: 240, protein: 26, isFromDietChart: true },
      { category: "post-workout", name: "High-Protein Smoothie", description: "1 Scoop Whey + 150g Curd + 1/2 Banana", calories: 300, protein: 35, isFromDietChart: true },
      { category: "post-workout", name: "The Whole Food Option", description: "200g Low-Fat Paneer, sautéed", calories: 320, protein: 36, isFromDietChart: true },
      { category: "post-workout", name: "Sattu Power Drink", description: "50g Sattu flour mixed in 300ml water with lemon & salt", calories: 200, protein: 12, isFromDietChart: true },
      { category: "post-workout", name: "Boiled Chickpeas", description: "1 cup (~150g, measured after boiling) of black chana", calories: 250, protein: 13, isFromDietChart: true },

      // Breakfast Options
      { category: "breakfast", name: "Besan Chilla", description: "2 medium chillas (from 100g besan) + 150g Curd", calories: 500, protein: 30, isFromDietChart: true },
      { category: "breakfast", name: "Sprouted Dal Salad", description: "1 large bowl (~250g) of sprouted moong + 50g Peanuts", calories: 450, protein: 25, isFromDietChart: true },
      { category: "breakfast", name: "Paneer Poha", description: "1 large plate of Poha with vegetables + 100g crumbled Paneer", calories: 520, protein: 22, isFromDietChart: true },
      { category: "breakfast", name: "Oats Upma", description: "1 large bowl (from 80g oats) with vegetables + 200ml Skim Milk", calories: 480, protein: 20, isFromDietChart: true },
      { category: "breakfast", name: "Savory Dalia", description: "1 large bowl of broken wheat porridge with mixed vegetables and lentils", calories: 430, protein: 15, isFromDietChart: true },

      // Lunch Options
      { category: "lunch", name: "Rajma/Chana Bowl", description: "1 large bowl of curry + 1.5 cups Brown Rice + Salad", calories: 600, protein: 25, isFromDietChart: true },
      { category: "lunch", name: "Soya Chunk Curry", description: "Curry with 60g (dry) Soya Chunks + 2 Rotis + 100g Curd", calories: 580, protein: 35, isFromDietChart: true },
      { category: "lunch", name: "Mixed Dal Tadka", description: "1 large bowl Dal + 1.5 cups Rice + Vegetable Sabzi", calories: 550, protein: 22, isFromDietChart: true },
      { category: "lunch", name: "Paneer Curry Bowl", description: "Simple tomato-based curry with 150g Paneer + 2 Rotis + Salad", calories: 620, protein: 30, isFromDietChart: true },
      { category: "lunch", name: "Tofu Pulao", description: "Vegetable pulao made with 1 cup rice + 150g cubed Tofu + Raita", calories: 590, protein: 24, isFromDietChart: true },

      // Evening Snack Options
      { category: "evening-snack", name: "Roasted Chana & Nuts", description: "1 cup Roasted Chana + handful of Peanuts/Almonds", calories: 350, protein: 15, isFromDietChart: true },
      { category: "evening-snack", name: "Simple Paneer", description: "100g Low-Fat Paneer cubes with chaat masala", calories: 160, protein: 18, isFromDietChart: true },
      { category: "evening-snack", name: "Greek Yogurt/Hung Curd", description: "1 cup (~200g) of homemade Hung Curd", calories: 120, protein: 20, isFromDietChart: true },
      { category: "evening-snack", name: "Fruit & Curd Bowl", description: "1 apple, 1/2 pomegranate mixed with 150g Curd", calories: 250, protein: 10, isFromDietChart: true },
      { category: "evening-snack", name: "Makhana & Peanuts", description: "2 cups of roasted fox nuts + 30g peanuts", calories: 300, protein: 12, isFromDietChart: true },

      // Dinner Options
      { category: "dinner", name: "Paneer Bhurji/Stir-Fry", description: "200g Paneer + vegetables + 1 Roti + Salad", calories: 500, protein: 40, isFromDietChart: true },
      { category: "dinner", name: "Tofu & Vegetable Stir-Fry", description: "200g Tofu + assorted vegetables + Salad", calories: 350, protein: 25, isFromDietChart: true },
      { category: "dinner", name: "High-Protein Dal Soup", description: "Very thick soup from 100g (dry) Moong/Masoor Dal", calories: 400, protein: 25, isFromDietChart: true },
      { category: "dinner", name: "Palak Paneer", description: "Homemade Palak Paneer (200g paneer, minimal oil) + Salad", calories: 480, protein: 42, isFromDietChart: true },
      { category: "dinner", name: "Lentil & Vegetable Stew", description: "Thick stew of mixed dals and vegetables (no rice/roti)", calories: 420, protein: 20, isFromDietChart: true },
    ];

    mealOptionsData.forEach(meal => {
      const mealOption: MealOption = { ...meal, id: randomUUID() };
      this.mealOptions.set(mealOption.id, mealOption);
    });
  }

  private initializeExercises() {
    const exercisesData: Omit<Exercise, 'id'>[] = [
      // Push exercises
      { name: "Dumbbell Bench Press", category: "push", muscleGroups: ["chest", "triceps", "shoulders"], equipment: "dumbbell" },
      { name: "Dumbbell Shoulder Press", category: "push", muscleGroups: ["shoulders", "triceps"], equipment: "dumbbell" },
      { name: "Incline Dumbbell Press", category: "push", muscleGroups: ["upper chest", "shoulders"], equipment: "dumbbell" },
      { name: "Dumbbell Lateral Raises", category: "push", muscleGroups: ["shoulders"], equipment: "dumbbell" },
      { name: "Resistance Band Push-ups", category: "push", muscleGroups: ["chest", "triceps", "shoulders"], equipment: "resistance-band" },
      { name: "Overhead Tricep Extension", category: "push", muscleGroups: ["triceps"], equipment: "dumbbell" },
      { name: "Dumbbell Chest Flys", category: "push", muscleGroups: ["chest"], equipment: "dumbbell" },

      // Pull exercises
      { name: "Dumbbell Bent-Over Row", category: "pull", muscleGroups: ["back", "biceps"], equipment: "dumbbell" },
      { name: "Resistance Band Pull-Aparts", category: "pull", muscleGroups: ["rear delts", "upper back"], equipment: "resistance-band" },
      { name: "Renegade Rows", category: "pull", muscleGroups: ["back", "core"], equipment: "dumbbell" },
      { name: "Dumbbell Bicep Curls", category: "pull", muscleGroups: ["biceps"], equipment: "dumbbell" },
      { name: "Dumbbell Hammer Curls", category: "pull", muscleGroups: ["biceps", "forearms"], equipment: "dumbbell" },
      { name: "Dumbbell Pullovers", category: "pull", muscleGroups: ["lats", "chest"], equipment: "dumbbell" },
      { name: "Band-Resisted Curls", category: "pull", muscleGroups: ["biceps"], equipment: "resistance-band" },

      // Legs exercises
      { name: "Dumbbell Goblet Squats", category: "legs", muscleGroups: ["quadriceps", "glutes"], equipment: "dumbbell" },
      { name: "Dumbbell Stiff-Leg Deadlifts", category: "legs", muscleGroups: ["hamstrings", "glutes"], equipment: "dumbbell" },
      { name: "Dumbbell Lunges", category: "legs", muscleGroups: ["quadriceps", "glutes"], equipment: "dumbbell" },
      { name: "Dumbbell Calf Raises", category: "legs", muscleGroups: ["calves"], equipment: "dumbbell" },
      { name: "Band-Resisted Glute Bridges", category: "legs", muscleGroups: ["glutes", "hamstrings"], equipment: "resistance-band" },
      { name: "Plank", category: "legs", muscleGroups: ["core"], equipment: "bodyweight" },
      { name: "Leg Raises", category: "legs", muscleGroups: ["core", "hip flexors"], equipment: "bodyweight" },
    ];

    exercisesData.forEach(exercise => {
      const exerciseObj: Exercise = { ...exercise, id: randomUUID() };
      this.exercises.set(exerciseObj.id, exerciseObj);
    });
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      currentStreak: 0,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.currentStreak = streak;
      this.users.set(userId, user);
    }
  }

  // User metrics
  async getUserMetrics(userId: string): Promise<UserMetrics[]> {
    return this.userMetrics.get(userId) || [];
  }

  async getLatestUserMetrics(userId: string): Promise<UserMetrics | undefined> {
    const metrics = this.userMetrics.get(userId) || [];
    return metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  async createUserMetrics(insertMetrics: InsertUserMetrics): Promise<UserMetrics> {
    const id = randomUUID();
    const metrics: UserMetrics = {
      ...insertMetrics,
      id,
      date: new Date()
    };
    
    const userMetrics = this.userMetrics.get(insertMetrics.userId) || [];
    userMetrics.push(metrics);
    this.userMetrics.set(insertMetrics.userId, userMetrics);
    
    return metrics;
  }

  // Meal options
  async getMealOptions(): Promise<MealOption[]> {
    return Array.from(this.mealOptions.values());
  }

  async getMealOptionsByCategory(category: string): Promise<MealOption[]> {
    return Array.from(this.mealOptions.values()).filter(meal => meal.category === category);
  }

  async createMealOption(insertMeal: InsertMealOption): Promise<MealOption> {
    const id = randomUUID();
    const meal: MealOption = { ...insertMeal, id };
    this.mealOptions.set(id, meal);
    return meal;
  }

  // Logged meals
  async getLoggedMeals(userId: string, date?: string): Promise<LoggedMeal[]> {
    const meals = this.loggedMeals.get(userId) || [];
    if (date) {
      return meals.filter(meal => meal.date.toDateString() === new Date(date).toDateString());
    }
    return meals;
  }

  async createLoggedMeal(insertMeal: InsertLoggedMeal): Promise<LoggedMeal> {
    const id = randomUUID();
    const meal: LoggedMeal = {
      ...insertMeal,
      id,
      date: new Date()
    };
    
    const userMeals = this.loggedMeals.get(insertMeal.userId) || [];
    userMeals.push(meal);
    this.loggedMeals.set(insertMeal.userId, userMeals);
    
    return meal;
  }

  async getTodaysLoggedMeals(userId: string): Promise<LoggedMeal[]> {
    const today = new Date().toDateString();
    return this.getLoggedMeals(userId, today);
  }

  // Exercises
  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => exercise.category === category);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // Workouts
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    return this.workouts.get(userId) || [];
  }

  async getRecentWorkouts(userId: string, limit: number): Promise<Workout[]> {
    const workouts = this.workouts.get(userId) || [];
    return workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = {
      ...insertWorkout,
      id,
      date: new Date()
    };
    
    const userWorkouts = this.workouts.get(insertWorkout.userId) || [];
    userWorkouts.push(workout);
    this.workouts.set(insertWorkout.userId, userWorkouts);
    
    return workout;
  }

  // Workout sets
  async getWorkoutSets(workoutId: string): Promise<WorkoutSet[]> {
    return this.workoutSets.get(workoutId) || [];
  }

  async createWorkoutSet(insertSet: InsertWorkoutSet): Promise<WorkoutSet> {
    const id = randomUUID();
    const set: WorkoutSet = { ...insertSet, id };
    
    const workoutSets = this.workoutSets.get(insertSet.workoutId) || [];
    workoutSets.push(set);
    this.workoutSets.set(insertSet.workoutId, workoutSets);
    
    return set;
  }

  // Personal records
  async getUserPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    return this.personalRecords.get(userId) || [];
  }

  async getPersonalRecord(userId: string, exerciseId: string): Promise<PersonalRecord | undefined> {
    const prs = this.personalRecords.get(userId) || [];
    return prs.find(pr => pr.exerciseId === exerciseId);
  }

  async createPersonalRecord(insertPR: InsertPersonalRecord): Promise<PersonalRecord> {
    const id = randomUUID();
    const pr: PersonalRecord = {
      ...insertPR,
      id,
      date: new Date()
    };
    
    const userPRs = this.personalRecords.get(insertPR.userId) || [];
    userPRs.push(pr);
    this.personalRecords.set(insertPR.userId, userPRs);
    
    return pr;
  }

  // Daily goals
  async getUserDailyGoals(userId: string): Promise<DailyGoals | undefined> {
    return this.dailyGoals.get(userId);
  }

  async createDailyGoals(insertGoals: InsertDailyGoals): Promise<DailyGoals> {
    const id = randomUUID();
    const goals: DailyGoals = { ...insertGoals, id };
    this.dailyGoals.set(insertGoals.userId, goals);
    return goals;
  }

  async updateDailyGoals(userId: string, updates: Partial<InsertDailyGoals>): Promise<void> {
    const goals = this.dailyGoals.get(userId);
    if (goals) {
      const updatedGoals = { ...goals, ...updates };
      this.dailyGoals.set(userId, updatedGoals);
    }
  }
}

export const storage = new MemStorage();
