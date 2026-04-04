import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-400/10 text-green-400 border-green-400/20" },
  inactive: { label: "Inactive", className: "bg-muted/50 text-muted-foreground border-border" },
  running: { label: "Running", className: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  error: { label: "Error", className: "bg-red-400/10 text-red-400 border-red-400/20" },
  pending: { label: "Pending", className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
  completed: { label: "Completed", className: "bg-green-400/10 text-green-400 border-green-400/20" },
  failed: { label: "Failed", className: "bg-red-400/10 text-red-400 border-red-400/20" },
  cancelled: { label: "Cancelled", className: "bg-muted/50 text-muted-foreground border-border" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted/50 text-muted-foreground border-border" },
  medium: { label: "Medium", className: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  high: { label: "High", className: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  critical: { label: "Critical", className: "bg-red-400/10 text-red-400 border-red-400/20" },
};

interface StatusBadgeProps {
  status: string;
  type?: "status" | "priority";
  className?: string;
}

export function StatusBadge({ status, type = "status", className }: StatusBadgeProps) {
  const config = type === "priority" ? priorityConfig[status] : statusConfig[status];
  if (!config) return <span className="text-muted-foreground text-xs">{status}</span>;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {type === "status" && status === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      )}
      {type === "status" && status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
      )}
      {config.label}
    </span>
  );
}
