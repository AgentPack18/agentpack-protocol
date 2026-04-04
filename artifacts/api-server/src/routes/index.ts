import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import healthRouter from "./health";
import agentsRouter from "./agents";
import tasksRouter from "./tasks";
import toolsRouter from "./tools";
import executionsRouter from "./executions";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use(healthRouter);
router.use(requireAuth);
router.use(agentsRouter);
router.use(tasksRouter);
router.use(toolsRouter);
router.use(executionsRouter);
router.use(dashboardRouter);

export default router;
