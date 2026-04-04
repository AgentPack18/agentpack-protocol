import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tasksTable, agentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  ListTasksQueryParams,
  CreateTaskBody,
  GetTaskParams,
  DeleteTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function formatTask(task: typeof tasksTable.$inferSelect) {
  let agentName: string | undefined;
  if (task.agentId) {
    const [agent] = await db.select({ name: agentsTable.name }).from(agentsTable).where(eq(agentsTable.id, task.agentId));
    agentName = agent?.name;
  }
  return {
    ...task,
    agentName,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    startedAt: task.startedAt?.toISOString(),
    completedAt: task.completedAt?.toISOString(),
  };
}

router.get("/tasks", async (req, res) => {
  const query = ListTasksQueryParams.parse(req.query);
  let tasksList = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt));

  if (query.status) {
    tasksList = tasksList.filter((t) => t.status === query.status);
  }
  if (query.agentId) {
    tasksList = tasksList.filter((t) => t.agentId === query.agentId);
  }

  const result = await Promise.all(tasksList.map(formatTask));
  res.json(result);
});

router.post("/tasks", async (req, res) => {
  const body = CreateTaskBody.parse(req.body);
  const [task] = await db.insert(tasksTable).values({
    title: body.title,
    description: body.description,
    priority: body.priority || "medium",
    agentId: body.agentId,
    input: body.input,
    status: "pending",
  }).returning();

  res.status(201).json(await formatTask(task));
});

router.get("/tasks/:taskId", async (req, res) => {
  const { taskId } = GetTaskParams.parse({ taskId: Number(req.params.taskId) });
  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId));

  if (!task) {
    res.status(404).json({ error: "Not Found", message: "Task not found" });
    return;
  }

  res.json(await formatTask(task));
});

router.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = DeleteTaskParams.parse({ taskId: Number(req.params.taskId) });
  await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
  res.status(204).send();
});

export default router;
