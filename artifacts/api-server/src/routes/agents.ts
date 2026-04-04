import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agentsTable, executionsTable, executionLogsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  ListAgentsQueryParams,
  CreateAgentBody,
  GetAgentParams,
  UpdateAgentParams,
  UpdateAgentBody,
  DeleteAgentParams,
  RunAgentParams,
  RunAgentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/agents", async (req, res) => {
  const query = ListAgentsQueryParams.parse(req.query);
  let agentsList = await db.select().from(agentsTable).orderBy(desc(agentsTable.createdAt));

  if (query.status) {
    agentsList = agentsList.filter((a) => a.status === query.status);
  }
  if (query.type) {
    agentsList = agentsList.filter((a) => a.type === query.type);
  }

  const result = agentsList.map((a) => ({
    ...a,
    toolIds: JSON.parse(a.toolIds || "[]"),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
  res.json(result);
});

router.post("/agents", async (req, res) => {
  const body = CreateAgentBody.parse(req.body);
  const [agent] = await db.insert(agentsTable).values({
    name: body.name,
    description: body.description,
    type: body.type,
    model: body.model,
    systemPrompt: body.systemPrompt,
    maxTokens: body.maxTokens,
    temperature: body.temperature,
    toolIds: JSON.stringify(body.toolIds || []),
    status: "inactive",
  }).returning();

  res.status(201).json({
    ...agent,
    toolIds: JSON.parse(agent.toolIds || "[]"),
    createdAt: agent.createdAt.toISOString(),
    updatedAt: agent.updatedAt.toISOString(),
  });
});

router.get("/agents/:agentId", async (req, res) => {
  const { agentId } = GetAgentParams.parse({ agentId: Number(req.params.agentId) });
  const [agent] = await db.select().from(agentsTable).where(eq(agentsTable.id, agentId));

  if (!agent) {
    res.status(404).json({ error: "Not Found", message: "Agent not found" });
    return;
  }

  res.json({
    ...agent,
    toolIds: JSON.parse(agent.toolIds || "[]"),
    createdAt: agent.createdAt.toISOString(),
    updatedAt: agent.updatedAt.toISOString(),
  });
});

router.put("/agents/:agentId", async (req, res) => {
  const { agentId } = UpdateAgentParams.parse({ agentId: Number(req.params.agentId) });
  const body = UpdateAgentBody.parse(req.body);

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.model !== undefined) updateData.model = body.model;
  if (body.systemPrompt !== undefined) updateData.systemPrompt = body.systemPrompt;
  if (body.maxTokens !== undefined) updateData.maxTokens = body.maxTokens;
  if (body.temperature !== undefined) updateData.temperature = body.temperature;
  if (body.toolIds !== undefined) updateData.toolIds = JSON.stringify(body.toolIds);

  const [agent] = await db.update(agentsTable)
    .set(updateData)
    .where(eq(agentsTable.id, agentId))
    .returning();

  if (!agent) {
    res.status(404).json({ error: "Not Found", message: "Agent not found" });
    return;
  }

  res.json({
    ...agent,
    toolIds: JSON.parse(agent.toolIds || "[]"),
    createdAt: agent.createdAt.toISOString(),
    updatedAt: agent.updatedAt.toISOString(),
  });
});

router.delete("/agents/:agentId", async (req, res) => {
  const { agentId } = DeleteAgentParams.parse({ agentId: Number(req.params.agentId) });
  await db.delete(agentsTable).where(eq(agentsTable.id, agentId));
  res.status(204).send();
});

router.post("/agents/:agentId/run", async (req, res) => {
  const { agentId } = RunAgentParams.parse({ agentId: Number(req.params.agentId) });
  const body = RunAgentBody.safeParse(req.body);

  const [agent] = await db.select().from(agentsTable).where(eq(agentsTable.id, agentId));
  if (!agent) {
    res.status(404).json({ error: "Not Found", message: "Agent not found" });
    return;
  }

  const input = body.success ? body.data.input : undefined;
  const startedAt = new Date();

  // Simulate agent execution
  const durationMs = Math.floor(Math.random() * 3000) + 500;
  const success = Math.random() > 0.2;
  const tokensUsed = Math.floor(Math.random() * 2000) + 100;

  const [execution] = await db.insert(executionsTable).values({
    agentId,
    status: success ? "completed" : "failed",
    input: input || "Manual trigger",
    output: success ? `Agent ${agent.name} completed successfully. Output generated with ${tokensUsed} tokens.` : undefined,
    errorMessage: success ? undefined : "Simulated execution error: model timeout",
    tokensUsed,
    durationMs,
    startedAt,
    completedAt: new Date(),
  }).returning();

  // Add some logs
  await db.insert(executionLogsTable).values([
    { executionId: execution.id, level: "info", message: `Starting agent: ${agent.name}`, timestamp: startedAt },
    { executionId: execution.id, level: "info", message: `Model: ${agent.model}, Max tokens: ${agent.maxTokens}`, timestamp: new Date(startedAt.getTime() + 100) },
    { executionId: execution.id, level: success ? "info" : "error", message: success ? "Execution completed successfully" : "Execution failed: model timeout", timestamp: new Date() },
  ]);

  // Update agent stats
  const newTotalRuns = agent.totalRuns + 1;
  const prevSuccessful = Math.round(agent.successRate * agent.totalRuns / 100);
  const newSuccessful = prevSuccessful + (success ? 1 : 0);
  const newSuccessRate = newTotalRuns > 0 ? (newSuccessful / newTotalRuns) * 100 : 0;
  const newAvgDuration = Math.round((agent.avgDurationMs * agent.totalRuns + durationMs) / newTotalRuns);

  await db.update(agentsTable).set({
    totalRuns: newTotalRuns,
    successRate: newSuccessRate,
    avgDurationMs: newAvgDuration,
    status: "active",
    updatedAt: new Date(),
  }).where(eq(agentsTable.id, agentId));

  res.json({
    ...execution,
    agentName: agent.name,
    createdAt: execution.startedAt.toISOString(),
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt?.toISOString(),
  });
});

export default router;
