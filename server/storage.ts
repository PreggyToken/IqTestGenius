import { 
  users, 
  type User, 
  type InsertUser,
  questions,
  type Question,
  type InsertQuestion,
  results,
  type Result,
  type InsertResult
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByName(name: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Result operations
  getResult(id: number): Promise<Result | undefined>;
  getResultsByUserId(userId: number): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private results: Map<number, Result>;
  
  private userIdCounter: number;
  private questionIdCounter: number;
  private resultIdCounter: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.results = new Map();
    
    this.userIdCounter = 1;
    this.questionIdCounter = 1;
    this.resultIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByName(name: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionIdCounter++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }
  
  // Result operations
  async getResult(id: number): Promise<Result | undefined> {
    return this.results.get(id);
  }
  
  async getResultsByUserId(userId: number): Promise<Result[]> {
    return Array.from(this.results.values()).filter(
      (result) => result.userId === userId,
    );
  }
  
  async createResult(insertResult: InsertResult): Promise<Result> {
    const id = this.resultIdCounter++;
    const result: Result = { ...insertResult, id };
    this.results.set(id, result);
    return result;
  }
}

export const storage = new MemStorage();
