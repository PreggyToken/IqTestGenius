import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User information schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  age: integer("age").notNull(),
  school: text("school").notNull(),
  gender: text("gender").notNull(),
  photoPath: text("photo_path").notNull(),
});

// Test questions schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  type: text("type").notNull(), // multiple_choice or short_answer
  options: jsonb("options").default(null), // For multiple choice questions
  answer: text("answer").default(null), // Correct answer if applicable
});

// Test results schema
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  iqScore: integer("iq_score").notNull(),
  iqCategory: text("iq_category").notNull(),
  percentile: integer("percentile").notNull(),
  explanation: text("explanation").notNull(),
  performance: jsonb("performance").notNull(), // Performance by category
  answers: jsonb("answers").notNull(), // User's answers to questions
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertQuestionSchema = createInsertSchema(questions);
export const insertResultSchema = createInsertSchema(results);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof results.$inferSelect;

// Custom form validation schema
export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
  age: z.coerce
    .number()
    .min(5, { message: "Age must be at least 5" })
    .max(120, { message: "Age must be at most 120" }),
  school: z.string().min(1, { message: "Please enter your last school attended" }),
  gender: z.string().optional(),
});

// Question types
export type QuestionType = "multiple_choice" | "short_answer";

export type MultipleChoiceQuestion = {
  id: string;
  type: "multiple_choice";
  question: string;
  options: string[];
};

export type ShortAnswerQuestion = {
  id: string;
  type: "short_answer";
  question: string;
};

export type IQQuestion = MultipleChoiceQuestion | ShortAnswerQuestion;

// Answer types
export type MultipleChoiceAnswer = {
  questionId: string;
  answer: string;
};

export type ShortAnswerAnswer = {
  questionId: string;
  answer: string;
};

export type IQAnswer = MultipleChoiceAnswer | ShortAnswerAnswer;

// Test result type
export type IQTestResult = {
  iqScore: number;
  iqCategory: string;
  percentile: number;
  explanation: string;
  performance: {
    category: string;
    percentage: number;
  }[];
};
