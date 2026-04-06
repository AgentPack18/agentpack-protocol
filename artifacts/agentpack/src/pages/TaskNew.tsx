import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTask,
  useListAgents,
  getListTasksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface TaskForm {
  title: string;
  description: string;
  priority: string;
  agentId: string;
  input: string;
}

export default function TaskNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createTask = useCreateTask();
  const { data: agents } = useListAgents();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TaskForm>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      agentId: "",
      input: "",
    },
  });

  const onSubmit = (data: TaskForm) => {
    createTask.mutate({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority as "low" | "medium" | "high" | "critical",
        agentId: data.agentId ? Number(data.agentId) : undefined,
        input: data.input,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        toast({ title: "Task created" });
        setLocation("/tasks");
      },
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/tasks">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">New Task</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create a new task for an agent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs">Title</Label>
                <Input
                  id="title"
                  data-testid="input-task-title"
                  className="mt-1.5"
                  placeholder="e.g. Analyze Q2 Revenue Data"
                  {...register("title", { required: true })}
                />
                {errors.title && <p className="text-xs text-red-400 mt-1">Title is required</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  data-testid="input-task-description"
                  className="mt-1.5 resize-none"
                  rows={2}
                  placeholder="What should be accomplished?"
                  {...register("description")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Select defaultValue="medium" onValueChange={(v) => setValue("priority", v)}>
                    <SelectTrigger data-testid="select-task-priority-form" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Assign Agent (optional)</Label>
                  <Select onValueChange={(v) => setValue("agentId", v)}>
                    <SelectTrigger data-testid="select-task-agent" className="mt-1.5">
                      <SelectValue placeholder="Select agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(agents) ? agents : []).map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="input" className="text-xs">Input / Instructions</Label>
                <Textarea
                  id="input"
                  data-testid="input-task-instructions"
                  className="mt-1.5 resize-none font-mono text-xs"
                  rows={4}
                  placeholder="Detailed instructions for the agent..."
                  {...register("input")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/tasks">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button data-testid="button-submit-task" type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
