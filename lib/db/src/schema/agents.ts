import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const agentsTable = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("executor"),
  status: text("status").notNull().default("inactive"),
  model: text("model").notNull().default("gpt-4o"),
  systemPrompt: text("system_prompt"),
  maxTokens: integer("max_tokens").default(4096),
  temperature: real("temperature").default(0.7),
  toolIds: text("tool_ids").default("[]"),
  totalRuns: integer("total_runs").notNull().default(0),
  successRate: real("success_rate").notNull().default(0),
  avgDurationMs: integer("avg_duration_ms").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agentsTable).omit({ id: true, totalRuns: true, successRate: true, avgDurationMs: true, createdAt: true, updatedAt: true });
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agentsTable.$inferSelect;
