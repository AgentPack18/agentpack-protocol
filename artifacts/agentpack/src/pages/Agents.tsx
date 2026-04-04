import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListAgents,
  useDeleteAgent,
  useRunAgent,
  getListAgentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Play, Trash2, Bot, ChevronRight } from "lucide-react";

const agentTypeColors: Record<string, string> = {
  orchestrator: "text-purple-400",
  executor: "text-blue-400",
  monitor: "text-green-400",
  analyzer: "text-yellow-400",
  communicator: "text-pink-400",
};

export default function Agents() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: agents, isLoading } = useListAgents();
  const deleteAgent = useDeleteAgent();
  const runAgent = useRunAgent();

  const filtered = agents?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    (a.description || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: number, name: string) {
    if (!confirm(`Delete agent "${name}"?`)) return;
    deleteAgent.mutate({ agentId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAgentsQueryKey() });
        toast({ title: "Agent deleted" });
      },
    });
  }

  function handleRun(id: number, name: string) {
    runAgent.mutate({ agentId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAgentsQueryKey() });
        toast({ title: `Agent "${name}" triggered`, description: "Execution started" });
      },
    });
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Agents</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your AI agent fleet</p>
          </div>
          <Link href="/agents/new">
            <Button data-testid="button-new-agent" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New Agent
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search-agents"
            placeholder="Search agents..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered?.map((agent) => (
              <Card key={agent.id} className="hover:border-primary/30 transition-colors cursor-pointer" data-testid={`card-agent-${agent.id}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted shrink-0">
                      <Bot className={`w-5 h-5 ${agentTypeColors[agent.type] || "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                        <StatusBadge status={agent.status} />
                        <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{agent.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{agent.description || "No description"}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">Model: <span className="text-foreground font-mono">{agent.model}</span></span>
                        <span className="text-xs text-muted-foreground">Runs: <span className="text-foreground">{agent.totalRuns}</span></span>
                        <span className="text-xs text-muted-foreground">Success: <span className={agent.successRate >= 90 ? "text-green-400" : agent.successRate >= 70 ? "text-yellow-400" : "text-red-400"}>{agent.successRate.toFixed(1)}%</span></span>
                        <span className="text-xs text-muted-foreground">Avg: <span className="text-foreground">{agent.avgDurationMs}ms</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        data-testid={`button-run-agent-${agent.id}`}
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        onClick={() => handleRun(agent.id, agent.name)}
                        disabled={runAgent.isPending}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-testid={`button-delete-agent-${agent.id}`}
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => handleDelete(agent.id, agent.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Link href={`/agents/${agent.id}`}>
                        <Button size="icon" variant="ghost" className="w-8 h-8">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No agents found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
