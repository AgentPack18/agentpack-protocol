import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { toolsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  CreateToolBody,
  GetToolParams,
  DeleteToolParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatTool(tool: typeof toolsTable.$inferSelect) {
  return {
    ...tool,
    createdAt: tool.createdAt.toISOString(),
    updatedAt: tool.updatedAt.toISOString(),
  };
}

router.get("/tools", async (_req, res) => {
  const toolsList = await db.select().from(toolsTable).orderBy(desc(toolsTable.createdAt));
  res.json(toolsList.map(formatTool));
});

router.post("/tools", async (req, res) => {
  const body = CreateToolBody.parse(req.body);
  const [tool] = await db.insert(toolsTable).values({
    name: body.name,
    description: body.description,
    category: body.category,
    inputSchema: body.inputSchema,
    isEnabled: true,
  }).returning();

  res.status(201).json(formatTool(tool));
});

router.get("/tools/:toolId", async (req, res) => {
  const { toolId } = GetToolParams.parse({ toolId: Number(req.params.toolId) });
  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.id, toolId));

  if (!tool) {
    res.status(404).json({ error: "Not Found", message: "Tool not found" });
    return;
  }

  res.json(formatTool(tool));
});

router.delete("/tools/:toolId", async (req, res) => {
  const { toolId } = DeleteToolParams.parse({ toolId: Number(req.params.toolId) });
  await db.delete(toolsTable).where(eq(toolsTable.id, toolId));
  res.status(204).send();
});

export default router;
