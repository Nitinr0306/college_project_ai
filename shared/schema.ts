import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  profilePicture: text("profile_picture"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  hostingProvider: text("hosting_provider"),
  monthlyTraffic: text("monthly_traffic"),
  carbonFootprint: integer("carbon_footprint"),
  sustainabilityScore: integer("sustainability_score"),
  carbonSaved: integer("carbon_saved").default(0),
  serverEfficiency: integer("server_efficiency"),
  assetOptimization: integer("asset_optimization"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
});

export const optimizations = pgTable("optimizations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  impact: text("impact").notNull().default("medium"),
  status: text("status").notNull().default("pending"),
  score: integer("score").notNull().default(0),
  recommendations: json("recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  profilePicture: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  url: true,
  description: true,
  hostingProvider: true,
  monthlyTraffic: true,
  carbonFootprint: true,
  sustainabilityScore: true,
  carbonSaved: true,
  serverEfficiency: true,
  assetOptimization: true,
  status: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  category: true,
  points: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges);

export const insertOptimizationSchema = createInsertSchema(optimizations).pick({
  projectId: true,
  title: true,
  description: true,
  category: true,
  impact: true,
  status: true,
  score: true,
  recommendations: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type InsertOptimization = z.infer<typeof insertOptimizationSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Optimization = typeof optimizations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
