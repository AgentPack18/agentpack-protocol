import { useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetExecution,
  useGetExecutionLogs,
  getGetExecutionQueryKey,
  getGetExecutionLogsQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Cpu, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const logLevelColors: Record<string, string> = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
  debug: "text-muted-foreground",
};

export default function ExecutionDetail() {
  const { executionId } = useParams<{ executionId: string }>();
  const id = Number(executionId);

  const { data: execution, isLoading } = useGetExecution(id, { query: { enabled: !!id, queryKey: getGetExecutionQueryKey(id) } });
  const { data: logs, isLoading: logsLoading } = useGetExecutionLogs(id, { query: { enabled: !!id, queryKey: getGetExecutionLogsQueryKey(id) } });

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/executions">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <div>
              <h1 className="text-xl font-bold text-foreground">Execution #{execution?.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                {execution && <StatusBadge status={execution.status} />}
                <span className="text-xs text-muted-foreground">{execution?.agentName}</span>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-xl font-bold mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {execution?.durationMs ? `${execution.durationMs}ms` : "Running..."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Tokens Used</p>
                <p className="text-xl font-bold mt-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  {execution?.tokensUsed?.toLocaleString() || "0"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="text-sm font-medium mt-1">{execution?.startedAt ? new Date(execution.startedAt).toLocaleString() : "-"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-medium mt-1">{execution?.completedAt ? new Date(execution.completedAt).toLocaleString() : "-"}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Input</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-24" /> : (
                <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                  {execution?.input || "No input provided"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm ${execution?.status === "failed" ? "text-red-400" : ""}`}>
                {execution?.status === "failed" ? "Error" : "Output"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-24" /> : (
                <p className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${execution?.status === "failed" ? "text-red-400" : "text-muted-foreground"}`}>
                  {execution?.errorMessage || execution?.output || "No output yet"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Execution Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-4 space-y-1.5 font-mono">
                {logs?.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs" data-testid={`log-entry-${log.id}`}>
                    <span className="text-muted-foreground shrink-0 w-40">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn("shrink-0 w-10 font-semibold uppercase", logLevelColors[log.level])}>
                      {log.level}
                    </span>
                    <span className="text-foreground">{log.message}</span>
                  </div>
                ))}
                {logs?.length === 0 && (
                  <p className="text-xs text-muted-foreground">No logs available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
