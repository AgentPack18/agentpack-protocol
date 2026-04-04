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
import { useCreateTool, getListToolsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface ToolForm {
  name: string;
  description: string;
  category: string;
  inputSchema: string;
}

export default function ToolNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createTool = useCreateTool();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ToolForm>({
    defaultValues: { name: "", description: "", category: "automation", inputSchema: "" },
  });

  const onSubmit = (data: ToolForm) => {
    createTool.mutate({
      data: {
        name: data.name,
        description: data.description,
        category: data.category as "web" | "data" | "code" | "communication" | "storage" | "analysis" | "automation",
        inputSchema: data.inputSchema,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListToolsQueryKey() });
        toast({ title: "Tool registered" });
        setLocation("/tools");
      },
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/tools">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Register Tool</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Add a new tool or skill for agents to use</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tool Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input
                  id="name"
                  data-testid="input-tool-name"
                  className="mt-1.5"
                  placeholder="e.g. PDF Reader"
                  {...register("name", { required: true })}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">Name is required</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  data-testid="input-tool-description"
                  className="mt-1.5 resize-none"
                  rows={3}
                  placeholder="What does this tool do?"
                  {...register("description")}
                />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Select defaultValue="automation" onValueChange={(v) => setValue("category", v)}>
                  <SelectTrigger data-testid="select-tool-category" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inputSchema" className="text-xs">Input Schema (JSON, optional)</Label>
                <Textarea
                  id="inputSchema"
                  data-testid="input-tool-schema"
                  className="mt-1.5 resize-none font-mono text-xs"
                  rows={5}
                  placeholder='{"type": "object", "properties": {"query": {"type": "string"}}}'
                  {...register("inputSchema")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/tools">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button data-testid="button-submit-tool" type="submit" disabled={createTool.isPending}>
              {createTool.isPending ? "Registering..." : "Register Tool"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
