import { todos, type Todo, type InsertTodo } from "@shared/schema";

export interface IStorage {
  getTodos(): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private todos: Map<number, Todo>;
  private currentId: number;

  constructor() {
    this.todos = new Map();
    this.currentId = 1;
  }

  async getTodos(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const id = this.currentId++;
    const todo: Todo = {
      id,
      text: insertTodo.text,
      completed: insertTodo.completed ?? false
    };
    this.todos.set(id, todo);
    return todo;
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo> {
    const existing = this.todos.get(id);
    if (!existing) {
      throw new Error(`Todo with id ${id} not found`);
    }
    const updated = { 
      ...existing,
      ...updates,
      completed: updates.completed ?? existing.completed
    };
    this.todos.set(id, updated);
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    if (!this.todos.delete(id)) {
      throw new Error(`Todo with id ${id} not found`);
    }
  }
}

export const storage = new MemStorage();