import { useLocation, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAgent,
  useRunAgent,
  useListExecutions,
  getGetAgentQueryKey,
  getListAgentsQueryKey,
  getListExecutionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Play, Bot, Cpu, Clock, TrendingUp } from "lucide-react";
import { StatusBadge as SB } from "@/components/StatusBadge";

export default function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const id = Number(agentId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: agent, isLoading } = useGetAgent(id, { query: { enabled: !!id, queryKey: getGetAgentQueryKey(id) } });
  const { data: executions, isLoading: execLoading } = useListExecutions({ agentId: id });
  const runAgent = useRunAgent();

  function handleRun() {
    runAgent.mutate({ agentId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAgentQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListExecutionsQueryKey({ agentId: id }) });
        toast({ title: "Agent triggered", description: "Execution started" });
      },
    });
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/agents">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground">{agent?.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {agent && <StatusBadge status={agent.status} />}
                  <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{agent?.type}</span>
                </div>
              </div>
              <Button onClick={handleRun} disabled={runAgent.isPending} size="sm">
                <Play className="w-3.5 h-3.5 mr-1.5" />
                {runAgent.isPending ? "Running..." : "Run Agent"}
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-xs">Total Runs</span>
                  </div>
                  <p className="text-2xl font-bold">{agent?.totalRuns}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span className="text-xs">Success Rate</span>
                  </div>
                  <p className={`text-2xl font-bold ${(agent?.successRate || 0) >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                    {agent?.successRate.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">Avg Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{agent?.avgDurationMs}ms</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-mono text-foreground">{agent?.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Tokens</span>
                    <span className="text-foreground">{agent?.maxTokens?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="text-foreground">{agent?.temperature}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground">{agent?.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "-"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">System Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap line-clamp-8">
                    {agent?.systemPrompt || "No system prompt configured"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            {execLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground font-medium py-2">ID</th>
                      <th className="text-left text-xs text-muted-foreground font-medium py-2">Status</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Duration</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Tokens</th>
                      <th className="text-right text-xs text-muted-foreground font-medium py-2">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions?.slice(0, 8).map((exec) => (
                      <tr key={exec.id} className="border-b border-border/50">
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">#{exec.id}</td>
                        <td className="py-2.5"><SB status={exec.status} /></td>
                        <td className="py-2.5 text-right text-muted-foreground">{exec.durationMs ? `${exec.durationMs}ms` : "-"}</td>
                        <td className="py-2.5 text-right text-muted-foreground">{exec.tokensUsed?.toLocaleString() || "-"}</td>
                        <td className="py-2.5 text-right text-muted-foreground">{exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                    {executions?.length === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">No executions yet</td></tr>
                    )}
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
