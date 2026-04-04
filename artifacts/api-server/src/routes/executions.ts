import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { executionsTable, executionLogsTable, agentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  ListExecutionsQueryParams,
  GetExecutionParams,
  GetExecutionLogsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function formatExecution(execution: typeof executionsTable.$inferSelect) {
  const [agent] = await db.select({ name: agentsTable.name }).from(agentsTable).where(eq(agentsTable.id, execution.agentId));
  return {
    ...execution,
    agentName: agent?.name || "Unknown Agent",
    createdAt: execution.startedAt.toISOString(),
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt?.toISOString(),
  };
}

router.get("/executions", async (req, res) => {
  const query = ListExecutionsQueryParams.parse(req.query);
  let executionsList = await db.select().from(executionsTable).orderBy(desc(executionsTable.startedAt)).limit(query.limit || 20);

  if (query.agentId) {
    executionsList = executionsList.filter((e) => e.agentId === query.agentId);
  }
  if (query.status) {
    executionsList = executionsList.filter((e) => e.status === query.status);
  }

  const result = await Promise.all(executionsList.map(formatExecution));
  res.json(result);
});

router.get("/executions/:executionId", async (req, res) => {
  const { executionId } = GetExecutionParams.parse({ executionId: Number(req.params.executionId) });
  const [execution] = await db.select().from(executionsTable).where(eq(executionsTable.id, executionId));

  if (!execution) {
    res.status(404).json({ error: "Not Found", message: "Execution not found" });
    return;
  }

  res.json(await formatExecution(execution));
});

router.get("/executions/:executionId/logs", async (req, res) => {
  const { executionId } = GetExecutionLogsParams.parse({ executionId: Number(req.params.executionId) });
  const logs = await db.select().from(executionLogsTable)
    .where(eq(executionLogsTable.executionId, executionId))
    .orderBy(executionLogsTable.timestamp);

  res.json(logs.map((log) => ({
    ...log,
    timestamp: log.timestamp.toISOString(),
  })));
});

export default router;
