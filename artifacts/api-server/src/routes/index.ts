import { Router, type IRouter } from "express";
import healthRouter from "./health";
import agentsRouter from "./agents";
import tasksRouter from "./tasks";
import toolsRouter from "./tools";
import executionsRouter from "./executions";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(agentsRouter);
router.use(tasksRouter);
router.use(toolsRouter);
router.use(executionsRouter);
router.use(dashboardRouter);

export default router;
