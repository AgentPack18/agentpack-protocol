import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardSummary,
  useGetRecentActivity,
  useGetAgentStats,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Bot,
  ListTodo,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Cpu,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`p-2 rounded-lg ${color || "bg-primary/10"}`}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity({ limit: 8 });
  const { data: agentStats, isLoading: statsLoading } = useGetAgentStats();

  const chartData = (Array.isArray(agentStats) ? agentStats : []).slice(0, 5).map((a) => ({
    name: a.agentName.split(" ")[0],
    runs: a.totalRuns,
    success: a.successfulRuns,
    failed: a.failedRuns,
  })) || [];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Mission Control</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time overview of all agents, tasks, and executions</p>
        </div>

        {summaryLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Bot} label="Total Agents" value={summary?.totalAgents || 0} sub={`${summary?.activeAgents || 0} active`} />
            <StatCard icon={ListTodo} label="Total Tasks" value={summary?.totalTasks || 0} sub={`${summary?.pendingTasks || 0} pending`} color="bg-accent/10" />
            <StatCard icon={Activity} label="Executions" value={summary?.totalExecutions || 0} sub={`${summary?.successfulExecutions || 0} successful`} color="bg-green-400/10" />
            <StatCard icon={TrendingUp} label="Success Rate" value={`${summary?.avgSuccessRate?.toFixed(1) || 0}%`} sub="overall" color="bg-blue-400/10" />
            <StatCard icon={CheckCircle2} label="Completed" value={summary?.completedTasks || 0} sub="tasks" color="bg-green-400/10" />
            <StatCard icon={XCircle} label="Failed" value={summary?.failedTasks || 0} sub="tasks" color="bg-red-400/10" />
            <StatCard icon={Cpu} label="Tokens Used" value={(summary?.totalTokensUsed || 0).toLocaleString()} sub="total" color="bg-purple-400/10" />
            <StatCard icon={Zap} label="Tools" value={summary?.totalTools || 0} sub="registered" color="bg-yellow-400/10" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-48" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={18}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }}
                    />
                    <Bar dataKey="success" name="Success" fill="hsl(142 76% 50%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="failed" name="Failed" fill="hsl(0 84% 60%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(Array.isArray(activity) ? activity : []).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                      <div className="mt-0.5">
                        {item.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                        {item.status === "failed" && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        {item.status === "running" && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                        {!["completed", "failed", "running"].includes(item.status || "") && <Activity className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <StatusBadge status={item.status || "unknown"} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Agent Overview</CardTitle>
              <Link href="/agents">
                <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-36" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground font-medium py-2">Agent</th>
                      <th className="text-left text-xs text-muted-foreground font-medium py-2">Type</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Runs</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Success Rate</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Avg Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(agentStats) ? agentStats : []).map((stat) => (
                      <tr key={stat.agentId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-medium text-foreground">{stat.agentName}</td>
                        <td className="py-2.5 text-muted-foreground capitalize">{stat.agentType}</td>
                        <td className="py-2.5 text-right text-foreground">{stat.totalRuns}</td>
                        <td className="py-2.5 text-right">
                          <span className={stat.successRate >= 90 ? "text-green-400" : stat.successRate >= 70 ? "text-yellow-400" : "text-red-400"}>
                            {stat.successRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-muted-foreground">{stat.avgDurationMs}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
