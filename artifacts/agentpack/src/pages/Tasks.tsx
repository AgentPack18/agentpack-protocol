import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
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
import {
  useListTasks,
  useDeleteTask,
  getListTasksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, ListTodo } from "lucide-react";

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks, isLoading } = useListTasks();
  const deleteTask = useDeleteTask();

  const filtered = (Array.isArray(tasks) ? tasks : []).filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  function handleDelete(id: number, title: string) {
    if (!confirm(`Delete task "${title}"?`)) return;
    deleteTask.mutate({ taskId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        toast({ title: "Task deleted" });
      },
    });
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage and monitor agent tasks</p>
          </div>
          <Link href="/tasks/new">
            <Button data-testid="button-new-task" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New Task
            </Button>
          </Link>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search-tasks"
              placeholder="Search tasks..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-task-status" className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger data-testid="select-task-priority" className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {(Array.isArray(filtered) ? filtered : []).map((task) => (
              <Card key={task.id} className="hover:border-primary/30 transition-colors" data-testid={`card-task-${task.id}`}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{task.title}</span>
                        <StatusBadge status={task.status} />
                        <StatusBadge status={task.priority} type="priority" />
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1.5">
                        {task.agentName && (
                          <span className="text-xs text-muted-foreground">Agent: <span className="text-foreground">{task.agentName}</span></span>
                        )}
                        <span className="text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</span>
                        {task.output && (
                          <span className="text-xs text-green-400 truncate max-w-xs">{task.output.slice(0, 60)}...</span>
                        )}
                        {task.errorMessage && (
                          <span className="text-xs text-red-400 truncate max-w-xs">{task.errorMessage.slice(0, 60)}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      data-testid={`button-delete-task-${task.id}`}
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 shrink-0"
                      onClick={() => handleDelete(task.id, task.title)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ListTodo className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No tasks found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
