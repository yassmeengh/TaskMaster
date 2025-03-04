import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTodoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.get("/api/todos", async (_req, res) => {
    const todos = await storage.getTodos();
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    const todo = insertTodoSchema.parse(req.body);
    const created = await storage.createTodo(todo);
    res.json(created);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    const id = z.coerce.number().parse(req.params.id);
    const updates = insertTodoSchema.partial().parse(req.body);
    const updated = await storage.updateTodo(id, updates);
    res.json(updated);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    const id = z.coerce.number().parse(req.params.id);
    await storage.deleteTodo(id);
    res.json({ success: true });
  });

  return createServer(app);
}
