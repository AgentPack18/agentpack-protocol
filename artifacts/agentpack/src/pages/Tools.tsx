import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListTools,
  useDeleteTool,
  getListToolsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Wrench, Globe, Code, Database, MessageSquare, HardDrive, BarChart2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  web: Globe,
  code: Code,
  data: Database,
  communication: MessageSquare,
  storage: HardDrive,
  analysis: BarChart2,
  automation: Zap,
};

const categoryColors: Record<string, string> = {
  web: "text-blue-400 bg-blue-400/10",
  code: "text-purple-400 bg-purple-400/10",
  data: "text-yellow-400 bg-yellow-400/10",
  communication: "text-pink-400 bg-pink-400/10",
  storage: "text-orange-400 bg-orange-400/10",
  analysis: "text-green-400 bg-green-400/10",
  automation: "text-cyan-400 bg-cyan-400/10",
};

export default function Tools() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tools, isLoading } = useListTools();
  const deleteTool = useDeleteTool();

  const filtered = tools?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: number, name: string) {
    if (!confirm(`Delete tool "${name}"?`)) return;
    deleteTool.mutate({ toolId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListToolsQueryKey() });
        toast({ title: "Tool deleted" });
      },
    });
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Tools</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Available skills and integrations for agents</p>
          </div>
          <Link href="/tools/new">
            <Button data-testid="button-new-tool" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Register Tool
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search-tools"
            placeholder="Search tools..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map((tool) => {
              const Icon = categoryIcons[tool.category] || Wrench;
              const colorClass = categoryColors[tool.category] || "text-muted-foreground bg-muted";
              return (
                <Card key={tool.id} data-testid={`card-tool-${tool.id}`} className={cn("hover:border-primary/30 transition-colors", !tool.isEnabled && "opacity-60")}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", tool.isEnabled ? "bg-green-400" : "bg-muted-foreground")} />
                        <Button
                          data-testid={`button-delete-tool-${tool.id}`}
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 text-red-400 hover:bg-red-400/10"
                          onClick={() => handleDelete(tool.id, tool.name)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.description || "No description"}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">{tool.category}</span>
                      <span className="text-xs text-muted-foreground">{tool.usageCount.toLocaleString()} uses</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filtered?.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <Wrench className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No tools found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
