import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListExecutions } from "@workspace/api-client-react";
import { Activity, ChevronRight, Clock, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Executions() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: executions, isLoading } = useListExecutions({ limit: 50 });

  const filtered = executions?.filter((e) => {
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchSearch = e.agentName.toLowerCase().includes(search.toLowerCase()) ||
      (e.input || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Executions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">History of agent execution runs</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search-executions"
              placeholder="Search by agent or input..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-execution-status" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered?.map((exec) => (
              <Link key={exec.id} href={`/executions/${exec.id}`}>
                <Card data-testid={`card-execution-${exec.id}`} className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">#{exec.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{exec.agentName}</span>
                          <StatusBadge status={exec.status} />
                        </div>
                        {exec.input && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{exec.input.slice(0, 80)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                        {exec.durationMs && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exec.durationMs}ms
                          </span>
                        )}
                        {exec.tokensUsed != null && (
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            {exec.tokensUsed.toLocaleString()}
                          </span>
                        )}
                        <span>{exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "-"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filtered?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No executions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
