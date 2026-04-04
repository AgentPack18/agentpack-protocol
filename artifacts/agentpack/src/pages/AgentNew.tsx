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
import { useCreateAgent, getListAgentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { ArrowLeft, Bot } from "lucide-react";
import { Link } from "wouter";

interface AgentForm {
  name: string;
  description: string;
  type: string;
  model: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

export default function AgentNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createAgent = useCreateAgent();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AgentForm>({
    defaultValues: {
      name: "",
      description: "",
      type: "executor",
      model: "gpt-4o",
      systemPrompt: "",
      maxTokens: 4096,
      temperature: 0.7,
    },
  });

  const onSubmit = (data: AgentForm) => {
    createAgent.mutate({
      data: {
        name: data.name,
        description: data.description,
        type: data.type as "orchestrator" | "executor" | "monitor" | "analyzer" | "communicator",
        model: data.model,
        systemPrompt: data.systemPrompt,
        maxTokens: Number(data.maxTokens),
        temperature: Number(data.temperature),
      }
    }, {
      onSuccess: (agent) => {
        queryClient.invalidateQueries({ queryKey: getListAgentsQueryKey() });
        toast({ title: "Agent created", description: agent.name });
        setLocation("/agents");
      },
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/agents">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">New Agent</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure a new AI agent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Bot className="w-4 h-4" /> Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input
                  id="name"
                  data-testid="input-agent-name"
                  className="mt-1.5"
                  placeholder="e.g. Data Analyst Pro"
                  {...register("name", { required: true })}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">Name is required</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  data-testid="input-agent-description"
                  className="mt-1.5 resize-none"
                  rows={2}
                  placeholder="What does this agent do?"
                  {...register("description")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select defaultValue="executor" onValueChange={(v) => setValue("type", v)}>
                    <SelectTrigger data-testid="select-agent-type" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orchestrator">Orchestrator</SelectItem>
                      <SelectItem value="executor">Executor</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="analyzer">Analyzer</SelectItem>
                      <SelectItem value="communicator">Communicator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Model</Label>
                  <Select defaultValue="gpt-4o" onValueChange={(v) => setValue("model", v)}>
                    <SelectTrigger data-testid="select-agent-model" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="systemPrompt" className="text-xs">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  data-testid="input-agent-system-prompt"
                  className="mt-1.5 resize-none font-mono text-xs"
                  rows={5}
                  placeholder="You are a specialized AI agent that..."
                  {...register("systemPrompt")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxTokens" className="text-xs">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    data-testid="input-agent-max-tokens"
                    type="number"
                    className="mt-1.5"
                    {...register("maxTokens")}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature" className="text-xs">Temperature (0-2)</Label>
                  <Input
                    id="temperature"
                    data-testid="input-agent-temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    className="mt-1.5"
                    {...register("temperature")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/agents">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button data-testid="button-submit-agent" type="submit" disabled={createAgent.isPending}>
              {createAgent.isPending ? "Creating..." : "Create Agent"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
