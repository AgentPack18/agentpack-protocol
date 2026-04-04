import { db } from "@workspace/db";
import { agentsTable, tasksTable, toolsTable, executionsTable, executionLogsTable } from "@workspace/db/schema";

async function seed() {
  console.log("Seeding Agentpack Protocol data...");

  // Seed tools first
  const tools = await db.insert(toolsTable).values([
    { name: "Web Search", description: "Search the internet for real-time information and retrieve web pages", category: "web", isEnabled: true, usageCount: 847 },
    { name: "Code Executor", description: "Execute Python, JavaScript, or Bash code in a sandboxed environment", category: "code", isEnabled: true, usageCount: 612 },
    { name: "Database Query", description: "Run SQL queries against connected databases and return structured results", category: "data", isEnabled: true, usageCount: 453 },
    { name: "Email Sender", description: "Send emails via SMTP with attachments and HTML content support", category: "communication", isEnabled: true, usageCount: 329 },
    { name: "File Storage", description: "Upload, download, and manage files in cloud object storage", category: "storage", isEnabled: true, usageCount: 218 },
    { name: "Data Analyzer", description: "Perform statistical analysis and generate insights from structured datasets", category: "analysis", isEnabled: true, usageCount: 501 },
    { name: "Slack Notifier", description: "Send messages and alerts to Slack channels and users", category: "communication", isEnabled: false, usageCount: 144 },
    { name: "Task Scheduler", description: "Schedule and manage cron-based automated tasks and workflows", category: "automation", isEnabled: true, usageCount: 267 },
  ]).returning();

  // Seed agents
  const agents = await db.insert(agentsTable).values([
    {
      name: "Alpha Orchestrator",
      description: "Master orchestration agent that decomposes complex tasks and coordinates specialized sub-agents",
      type: "orchestrator",
      status: "active",
      model: "gpt-4o",
      systemPrompt: "You are the Alpha Orchestrator. Your role is to break down complex user requests into subtasks and delegate them to specialized agents efficiently.",
      maxTokens: 8192,
      temperature: 0.3,
      toolIds: JSON.stringify([tools[0].id, tools[5].id]),
      totalRuns: 143,
      successRate: 94.4,
      avgDurationMs: 2840,
    },
    {
      name: "Scout Analyzer",
      description: "Specialized analytics agent for data analysis, pattern recognition, and insight generation",
      type: "analyzer",
      status: "active",
      model: "claude-3-5-sonnet",
      systemPrompt: "You are Scout Analyzer. Analyze data, identify patterns, and generate actionable insights with precise statistical reasoning.",
      maxTokens: 4096,
      temperature: 0.1,
      toolIds: JSON.stringify([tools[2].id, tools[5].id]),
      totalRuns: 89,
      successRate: 97.8,
      avgDurationMs: 1620,
    },
    {
      name: "Nexus Executor",
      description: "High-performance execution agent for running code, scripts, and automated workflows",
      type: "executor",
      status: "running",
      model: "gpt-4o-mini",
      systemPrompt: "You are Nexus Executor. Execute code and scripts reliably, handle errors gracefully, and return clean structured outputs.",
      maxTokens: 2048,
      temperature: 0.0,
      toolIds: JSON.stringify([tools[1].id, tools[4].id]),
      totalRuns: 312,
      successRate: 88.1,
      avgDurationMs: 980,
    },
    {
      name: "Pulse Monitor",
      description: "Continuous monitoring agent that tracks system health, performance metrics, and anomalies",
      type: "monitor",
      status: "active",
      model: "gpt-4o-mini",
      systemPrompt: "You are Pulse Monitor. Continuously watch system metrics, detect anomalies, and generate alerts when thresholds are exceeded.",
      maxTokens: 1024,
      temperature: 0.2,
      toolIds: JSON.stringify([tools[0].id, tools[6].id]),
      totalRuns: 678,
      successRate: 99.1,
      avgDurationMs: 450,
    },
    {
      name: "Comm Bridge",
      description: "Communication agent handling email, Slack, and cross-platform messaging workflows",
      type: "communicator",
      status: "inactive",
      model: "gpt-4o",
      systemPrompt: "You are Comm Bridge. Handle all communication tasks — drafting messages, sending notifications, and coordinating team updates.",
      maxTokens: 2048,
      temperature: 0.7,
      toolIds: JSON.stringify([tools[3].id, tools[6].id]),
      totalRuns: 56,
      successRate: 91.1,
      avgDurationMs: 1240,
    },
  ]).returning();

  // Seed tasks
  const tasks = await db.insert(tasksTable).values([
    {
      title: "Analyze Q1 Sales Pipeline",
      description: "Run comprehensive analysis on Q1 sales data and generate executive summary",
      status: "completed",
      priority: "high",
      agentId: agents[1].id,
      input: "Analyze Q1 sales data from the database and provide insights on trends, top performers, and areas for improvement.",
      output: "Analysis complete. Q1 revenue up 23% YoY. Top 3 regions: APAC (+41%), EU (+18%), NA (+12%). Identified 3 at-risk accounts.",
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3400000),
    },
    {
      title: "Deploy Microservice Update",
      description: "Execute deployment pipeline for the payment microservice v2.3.1",
      status: "running",
      priority: "critical",
      agentId: agents[2].id,
      input: "Deploy payment-service:v2.3.1 to production. Run tests, verify health checks, and rollback on failure.",
      startedAt: new Date(Date.now() - 600000),
    },
    {
      title: "Weekly Performance Report",
      description: "Generate and distribute weekly performance report to stakeholders",
      status: "pending",
      priority: "medium",
      agentId: agents[0].id,
      input: "Collect metrics from all monitored services and generate weekly performance report. Email to leadership team.",
    },
    {
      title: "Database Optimization Audit",
      description: "Audit slow queries and suggest index optimizations",
      status: "completed",
      priority: "high",
      agentId: agents[1].id,
      input: "Analyze query performance logs and identify top 10 slowest queries with optimization recommendations.",
      output: "Found 7 missing indexes. Estimated 68% query performance improvement. Recommendations attached.",
      startedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 83000000),
    },
    {
      title: "Alert on API Error Spike",
      description: "Investigate and report on the API 5xx error spike detected at 14:23",
      status: "failed",
      priority: "critical",
      agentId: agents[3].id,
      input: "Investigate API error spike. Identify root cause, affected endpoints, and escalate if SLA breach detected.",
      errorMessage: "Unable to access log aggregation service. Connection timeout after 30s.",
      startedAt: new Date(Date.now() - 7200000),
      completedAt: new Date(Date.now() - 7100000),
    },
    {
      title: "Onboarding Email Sequence",
      description: "Trigger onboarding email sequence for 47 new users registered today",
      status: "pending",
      priority: "low",
      agentId: agents[4].id,
      input: "Fetch new user registrations from today, personalize onboarding emails, and send via SMTP.",
    },
  ]).returning();

  // Seed executions
  const now = Date.now();
  const execs = await db.insert(executionsTable).values([
    {
      agentId: agents[0].id,
      taskId: tasks[2].id,
      status: "completed",
      input: "Orchestrate Q1 sales pipeline analysis",
      output: "Successfully delegated to Scout Analyzer. Report generated and distributed.",
      tokensUsed: 1847,
      durationMs: 3210,
      startedAt: new Date(now - 7200000),
      completedAt: new Date(now - 7196790),
    },
    {
      agentId: agents[1].id,
      taskId: tasks[0].id,
      status: "completed",
      input: "Analyze Q1 sales data from the database",
      output: "Q1 revenue up 23% YoY. Full report generated.",
      tokensUsed: 2103,
      durationMs: 1620,
      startedAt: new Date(now - 3600000),
      completedAt: new Date(now - 3598380),
    },
    {
      agentId: agents[2].id,
      taskId: tasks[1].id,
      status: "running",
      input: "Deploy payment-service:v2.3.1 to production",
      tokensUsed: 512,
      startedAt: new Date(now - 600000),
    },
    {
      agentId: agents[3].id,
      status: "completed",
      input: "Health check: API latency monitoring",
      output: "All endpoints healthy. P99 latency: 142ms",
      tokensUsed: 234,
      durationMs: 450,
      startedAt: new Date(now - 1800000),
      completedAt: new Date(now - 1799550),
    },
    {
      agentId: agents[4].id,
      taskId: tasks[4].id,
      status: "failed",
      input: "Investigate API error spike at 14:23",
      errorMessage: "Unable to access log aggregation service. Connection timeout after 30s.",
      tokensUsed: 340,
      durationMs: 30000,
      startedAt: new Date(now - 7200000),
      completedAt: new Date(now - 7170000),
    },
    {
      agentId: agents[1].id,
      taskId: tasks[3].id,
      status: "completed",
      input: "Audit database slow queries",
      output: "Found 7 missing indexes. Estimated 68% improvement.",
      tokensUsed: 1560,
      durationMs: 1890,
      startedAt: new Date(now - 86400000),
      completedAt: new Date(now - 86398110),
    },
  ]).returning();

  // Seed execution logs
  await db.insert(executionLogsTable).values([
    { executionId: execs[0].id, level: "info", message: "Orchestrator initialized", timestamp: new Date(now - 7200000) },
    { executionId: execs[0].id, level: "info", message: "Delegating task to Scout Analyzer", timestamp: new Date(now - 7199500) },
    { executionId: execs[0].id, level: "info", message: "Received results from Scout Analyzer", timestamp: new Date(now - 7196900) },
    { executionId: execs[0].id, level: "info", message: "Report distributed to 5 stakeholders", timestamp: new Date(now - 7196800) },
    { executionId: execs[1].id, level: "info", message: "Starting data analysis pipeline", timestamp: new Date(now - 3600000) },
    { executionId: execs[1].id, level: "info", message: "Querying sales database: 47,382 records fetched", timestamp: new Date(now - 3599800) },
    { executionId: execs[1].id, level: "info", message: "Running statistical models", timestamp: new Date(now - 3599200) },
    { executionId: execs[1].id, level: "info", message: "Generating executive summary", timestamp: new Date(now - 3598600) },
    { executionId: execs[4].id, level: "info", message: "Investigation started", timestamp: new Date(now - 7200000) },
    { executionId: execs[4].id, level: "warn", message: "Log aggregation service unreachable, retrying...", timestamp: new Date(now - 7180000) },
    { executionId: execs[4].id, level: "error", message: "Connection timeout: log-aggregator:9200", timestamp: new Date(now - 7170000) },
  ]);

  console.log("Seed complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
