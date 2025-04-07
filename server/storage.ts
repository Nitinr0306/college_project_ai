import { users, type User, type InsertUser } from "@shared/schema";
import { projects, type Project, type InsertProject } from "@shared/schema";
import { badges, type Badge, type InsertBadge } from "@shared/schema";
import { userBadges, type UserBadge, type InsertUserBadge } from "@shared/schema";
import { optimizations, type Optimization, type InsertOptimization } from "@shared/schema";
import { chatMessages, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";

// Add session store type
declare module "express-session" {
  interface SessionStore {
    [key: string]: any;
  }
}

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Badge operations
  getBadge(id: number): Promise<Badge | undefined>;
  getAllBadges(): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // UserBadge operations
  getUserBadges(userId: number): Promise<Badge[]>;
  assignBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Optimization operations
  getOptimizationsByProjectId(projectId: number): Promise<Optimization[]>;
  createOptimization(optimization: InsertOptimization): Promise<Optimization>;
  
  // Chat operations
  getChatMessagesByUserId(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private optimizations: Map<number, Optimization>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private badgeIdCounter: number;
  private userBadgeIdCounter: number;
  private optimizationIdCounter: number;
  private chatMessageIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.optimizations = new Map();
    this.chatMessages = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.badgeIdCounter = 1;
    this.userBadgeIdCounter = 1;
    this.optimizationIdCounter = 1;
    this.chatMessageIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed some initial badges
    this.initializeBadges();
  }

  private initializeBadges() {
    const defaultBadges = [
      {
        name: "Green Host Pioneer",
        description: "Switched to a green hosting provider",
        icon: "eco",
        category: "hosting",
        points: 100
      },
      {
        name: "Speed Optimizer",
        description: "Improved website loading speed by 50%",
        icon: "speed",
        category: "performance",
        points: 75
      },
      {
        name: "Compression Master",
        description: "Reduced asset sizes by at least 40%",
        icon: "compress",
        category: "optimization",
        points: 50
      },
      {
        name: "Image Optimizer",
        description: "Optimized all images on your website",
        icon: "image",
        category: "optimization",
        points: 50
      },
      {
        name: "Clean Code Hero", 
        description: "Removed unnecessary code and dependencies",
        icon: "code",
        category: "code",
        points: 75
      },
      {
        name: "Carbon Reducer",
        description: "Reduced carbon footprint by at least 30%",
        icon: "public",
        category: "carbon",
        points: 100
      }
    ];
    
    defaultBadges.forEach(badge => {
      this.createBadge({
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        points: badge.points
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user", 
      name: insertUser.name || null,
      profilePicture: insertUser.profilePicture || null,
      createdAt: now, 
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.userId === userId
    );
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      hostingProvider: insertProject.hostingProvider || null,
      monthlyTraffic: insertProject.monthlyTraffic || null,
      carbonFootprint: 0,
      sustainabilityScore: 0,
      carbonSaved: 0,
      serverEfficiency: 0,
      assetOptimization: 0,
      status: "new",
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = {
      ...project,
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Badge operations
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.badgeIdCounter++;
    const now = new Date();
    const badge: Badge = {
      ...insertBadge,
      id,
      createdAt: now
    };
    this.badges.set(id, badge);
    return badge;
  }
  
  // UserBadge operations
  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgeEntries = Array.from(this.userBadges.values()).filter(
      userBadge => userBadge.userId === userId
    );
    
    return Promise.all(
      userBadgeEntries.map(async entry => {
        const badge = await this.getBadge(entry.badgeId);
        return badge!;
      })
    );
  }
  
  async assignBadgeToUser(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if user already has this badge
    const existingBadge = Array.from(this.userBadges.values()).find(
      ub => ub.userId === insertUserBadge.userId && ub.badgeId === insertUserBadge.badgeId
    );
    
    if (existingBadge) {
      return existingBadge;
    }
    
    const id = this.userBadgeIdCounter++;
    const now = new Date();
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      earnedAt: insertUserBadge.earnedAt || now,
      projectId: insertUserBadge.projectId || null,
      achievedAt: now
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
  
  // Optimization operations
  async getOptimizationsByProjectId(projectId: number): Promise<Optimization[]> {
    return Array.from(this.optimizations.values()).filter(
      optimization => optimization.projectId === projectId
    );
  }
  
  async createOptimization(insertOptimization: InsertOptimization): Promise<Optimization> {
    const id = this.optimizationIdCounter++;
    const now = new Date();
    const optimization: Optimization = {
      ...insertOptimization,
      id,
      title: insertOptimization.title || "Optimization",
      description: insertOptimization.description || "Optimization recommendation",
      category: insertOptimization.category || "general",
      status: insertOptimization.status || "pending",
      impact: insertOptimization.impact || "medium",
      score: insertOptimization.score || 0,
      recommendations: insertOptimization.recommendations || null,
      createdAt: now
    };
    this.optimizations.set(id, optimization);
    return optimization;
  }
  
  // Chat operations
  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const now = new Date();
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      createdAt: now
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    // Create a PostgreSQL session store
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "session",
      createTableIfMissing: true
    });
    
    // Initialize badges when needed
    this.initializeBadgesIfNeeded();
  }
  
  private async initializeBadgesIfNeeded() {
    const existingBadges = await this.getAllBadges();
    
    if (existingBadges.length === 0) {
      const defaultBadges = [
        {
          name: "Green Host Pioneer",
          description: "Switched to a green hosting provider",
          icon: "eco",
          category: "hosting",
          points: 100
        },
        {
          name: "Speed Optimizer",
          description: "Improved website loading speed by 50%",
          icon: "speed",
          category: "performance",
          points: 75
        },
        {
          name: "Compression Master",
          description: "Reduced asset sizes by at least 40%",
          icon: "compress",
          category: "optimization",
          points: 50
        },
        {
          name: "Image Optimizer",
          description: "Optimized all images on your website",
          icon: "image",
          category: "optimization",
          points: 50
        },
        {
          name: "Clean Code Hero", 
          description: "Removed unnecessary code and dependencies",
          icon: "code",
          category: "code",
          points: 75
        },
        {
          name: "Carbon Reducer",
          description: "Reduced carbon footprint by at least 30%",
          icon: "public",
          category: "carbon",
          points: 100
        }
      ];
      
      for (const badge of defaultBadges) {
        await this.createBadge(badge);
      }
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      name: insertUser.name || null,
      profilePicture: insertUser.profilePicture || null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values({
      ...insertProject,
      description: insertProject.description || null,
      hostingProvider: insertProject.hostingProvider || null,
      monthlyTraffic: insertProject.monthlyTraffic || null,
      carbonFootprint: 0,
      sustainabilityScore: 0,
      carbonSaved: 0,
      serverEfficiency: 0,
      assetOptimization: 0,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return project;
  }
  
  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db.update(projects)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return !!result;
  }
  
  // Badge operations
  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }
  
  async getAllBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values({
      ...insertBadge,
      createdAt: new Date()
    }).returning();
    return badge;
  }
  
  // UserBadge operations
  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgesResult = await db.select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
    
    const badgeIds = userBadgesResult.map(ub => ub.badgeId);
    
    if (badgeIds.length === 0) {
      return [];
    }
    
    return await Promise.all(
      badgeIds.map(async (badgeId) => {
        const badge = await this.getBadge(badgeId);
        return badge!;
      })
    );
  }
  
  async assignBadgeToUser(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if user already has this badge
    const [existingUserBadge] = await db.select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, insertUserBadge.userId),
          eq(userBadges.badgeId, insertUserBadge.badgeId)
        )
      );
    
    if (existingUserBadge) {
      return existingUserBadge;
    }
    
    const [userBadge] = await db.insert(userBadges).values({
      ...insertUserBadge,
      earnedAt: insertUserBadge.earnedAt || new Date(),
      projectId: insertUserBadge.projectId || null,
      achievedAt: new Date()
    }).returning();
    
    return userBadge;
  }
  
  // Optimization operations
  async getOptimizationsByProjectId(projectId: number): Promise<Optimization[]> {
    return await db.select()
      .from(optimizations)
      .where(eq(optimizations.projectId, projectId));
  }
  
  async createOptimization(insertOptimization: InsertOptimization): Promise<Optimization> {
    const [optimization] = await db.insert(optimizations).values({
      ...insertOptimization,
      title: insertOptimization.title || "Optimization",
      description: insertOptimization.description || "Optimization recommendation",
      category: insertOptimization.category || "general",
      status: insertOptimization.status || "pending",
      impact: insertOptimization.impact || "medium",
      score: insertOptimization.score || 0,
      recommendations: insertOptimization.recommendations || null,
      createdAt: new Date()
    }).returning();
    
    return optimization;
  }
  
  // Chat operations
  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt);
  }
  
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values({
      ...insertChatMessage,
      createdAt: new Date()
    }).returning();
    
    return message;
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
