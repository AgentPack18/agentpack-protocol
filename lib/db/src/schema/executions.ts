import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const executionsTable = pgTable("executions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  taskId: integer("task_id"),
  status: text("status").notNull().default("running"),
  input: text("input"),
  output: text("output"),
  errorMessage: text("error_message"),
  tokensUsed: integer("tokens_used").default(0),
  durationMs: integer("duration_ms"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const executionLogsTable = pgTable("execution_logs", {
  id: serial("id").primaryKey(),
  executionId: integer("execution_id").notNull(),
  level: text("level").notNull().default("info"),
  message: text("message").notNull(),
  data: text("data"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertExecutionSchema = createInsertSchema(executionsTable).omit({ id: true, createdAt: true });
export type InsertExecution = z.infer<typeof insertExecutionSchema>;
export type Execution = typeof executionsTable.$inferSelect;

export const insertExecutionLogSchema = createInsertSchema(executionLogsTable).omit({ id: true });
export type InsertExecutionLog = z.infer<typeof insertExecutionLogSchema>;
export type ExecutionLog = typeof executionLogsTable.$inferSelect;
