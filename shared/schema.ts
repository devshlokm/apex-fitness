import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  currentStreak: integer("current_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userMetrics = pgTable("user_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  weight: real("weight"),
  bmi: real("bmi"),
  bodyFat: real("body_fat"),
  muscleRate: real("muscle_rate"),
  fatFreeBodyWeight: real("fat_free_body_weight"),
  subcutaneousFat: real("subcutaneous_fat"),
  visceralFat: real("visceral_fat"),
  bodyWater: real("body_water"),
  skeletalMuscle: real("skeletal_muscle"),
  muscleMass: real("muscle_mass"),
  boneMass: real("bone_mass"),
  protein: real("protein"),
  bmr: integer("bmr"),
  bodyAge: integer("body_age"),
});

export const mealOptions = pgTable("meal_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // "post-workout", "breakfast", "lunch", "evening-snack", "dinner"
  name: text("name").notNull(),
  description: text("description").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  isFromDietChart: boolean("is_from_diet_chart").default(true),
});

export const loggedMeals = pgTable("logged_meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealOptionId: varchar("meal_option_id").references(() => mealOptions.id),
  customMealName: text("custom_meal_name"),
  customCalories: integer("custom_calories"),
  customProtein: real("custom_protein"),
  date: timestamp("date").defaultNow(),
  mealType: text("meal_type").notNull(), // "breakfast", "lunch", "dinner", "snack"
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // "push", "pull", "legs"
  muscleGroups: text("muscle_groups").array(),
  equipment: text("equipment"),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // "push", "pull", "legs"
  duration: integer("duration"), // in minutes
  date: timestamp("date").defaultNow(),
  notes: text("notes"),
});

export const workoutSets = pgTable("workout_sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id),
  exerciseId: varchar("exercise_id").notNull().references(() => exercises.id),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: real("weight"),
  isPersonalRecord: boolean("is_personal_record").default(false),
});

export const personalRecords = pgTable("personal_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: varchar("exercise_id").notNull().references(() => exercises.id),
  weight: real("weight").notNull(),
  reps: integer("reps").notNull(),
  date: timestamp("date").defaultNow(),
});

export const dailyGoals = pgTable("daily_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetCalories: integer("target_calories").default(2300),
  targetProtein: real("target_protein").default(180),
  targetWorkouts: integer("target_workouts").default(6),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertUserMetricsSchema = createInsertSchema(userMetrics).omit({ id: true, date: true });
export const insertMealOptionSchema = createInsertSchema(mealOptions).omit({ id: true });
export const insertLoggedMealSchema = createInsertSchema(loggedMeals).omit({ id: true, date: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true, date: true });
export const insertWorkoutSetSchema = createInsertSchema(workoutSets).omit({ id: true });
export const insertPersonalRecordSchema = createInsertSchema(personalRecords).omit({ id: true, date: true });
export const insertDailyGoalsSchema = createInsertSchema(dailyGoals).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserMetrics = typeof userMetrics.$inferSelect;
export type InsertUserMetrics = z.infer<typeof insertUserMetricsSchema>;
export type MealOption = typeof mealOptions.$inferSelect;
export type InsertMealOption = z.infer<typeof insertMealOptionSchema>;
export type LoggedMeal = typeof loggedMeals.$inferSelect;
export type InsertLoggedMeal = z.infer<typeof insertLoggedMealSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type InsertWorkoutSet = z.infer<typeof insertWorkoutSetSchema>;
export type PersonalRecord = typeof personalRecords.$inferSelect;
export type InsertPersonalRecord = z.infer<typeof insertPersonalRecordSchema>;
export type DailyGoals = typeof dailyGoals.$inferSelect;
export type InsertDailyGoals = z.infer<typeof insertDailyGoalsSchema>;
