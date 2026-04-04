import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agentsTable, tasksTable, executionsTable, toolsTable } from "@workspace/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import {
  GetRecentActivityQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const agents = await db.select().from(agentsTable);
  const tasks = await db.select().from(tasksTable);
  const executions = await db.select().from(executionsTable);
  const tools = await db.select().from(toolsTable);

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "running").length;
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const runningTasks = tasks.filter((t) => t.status === "running").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const failedTasks = tasks.filter((t) => t.status === "failed").length;
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter((e) => e.status === "completed").length;
  const avgSuccessRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
  const totalTokensUsed = executions.reduce((sum, e) => sum + (e.tokensUsed || 0), 0);
  const totalTools = tools.length;

  res.json({
    totalAgents,
    activeAgents,
    totalTasks,
    pendingTasks,
    runningTasks,
    completedTasks,
    failedTasks,
    totalExecutions,
    successfulExecutions,
    avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
    totalTokensUsed,
    totalTools,
  });
});

router.get("/dashboard/activity", async (req, res) => {
  const query = GetRecentActivityQueryParams.parse(req.query);
  const limit = query.limit || 10;

  const executions = await db.select().from(executionsTable)
    .orderBy(desc(executionsTable.startedAt))
    .limit(limit);

  const agentIds = [...new Set(executions.map((e) => e.agentId))];
  const agentsMap: Record<number, string> = {};
  for (const agentId of agentIds) {
    const [agent] = await db.select({ name: agentsTable.name }).from(agentsTable).where(eq(agentsTable.id, agentId));
    if (agent) agentsMap[agentId] = agent.name;
  }

  const activities = executions.map((e, i) => ({
    id: e.id,
    type: e.status === "completed" ? "task_completed" as const : e.status === "failed" ? "task_failed" as const : "agent_run" as const,
    title: e.status === "completed" ? "Execution completed" : e.status === "failed" ? "Execution failed" : "Agent running",
    description: `Agent ${agentsMap[e.agentId] || "Unknown"} ${e.status === "completed" ? `completed in ${e.durationMs}ms` : e.status === "failed" ? "encountered an error" : "is running"}`,
    agentName: agentsMap[e.agentId] || "Unknown",
    status: e.status,
    createdAt: e.startedAt.toISOString(),
  }));

  res.json(activities);
});

router.get("/dashboard/agent-stats", async (_req, res) => {
  const agents = await db.select().from(agentsTable);
  const executions = await db.select().from(executionsTable);

  const stats = agents.map((agent) => {
    const agentExecutions = executions.filter((e) => e.agentId === agent.id);
    const totalRuns = agentExecutions.length;
    const successfulRuns = agentExecutions.filter((e) => e.status === "completed").length;
    const failedRuns = agentExecutions.filter((e) => e.status === "failed").length;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;
    const avgDurationMs = totalRuns > 0
      ? Math.round(agentExecutions.reduce((sum, e) => sum + (e.durationMs || 0), 0) / totalRuns)
      : 0;
    const totalTokensUsed = agentExecutions.reduce((sum, e) => sum + (e.tokensUsed || 0), 0);

    return {
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate: Math.round(successRate * 10) / 10,
      avgDurationMs,
      totalTokensUsed,
    };
  });

  res.json(stats);
});

export default router;
