import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import agentsRouter from "./agents";
import tasksRouter from "./tasks";
import toolsRouter from "./tools";
import executionsRouter from "./executions";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" }); return;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString();
    const [userId, email] = decoded.split(":");
    (req as any).userId = userId;
    (req as any).userEmail = email;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.use(healthRouter);
router.use(authRouter);
router.use(requireAuth);
router.use(agentsRouter);
router.use(tasksRouter);
router.use(toolsRouter);
router.use(executionsRouter);
router.use(dashboardRouter);

export default router;
