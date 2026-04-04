import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  Wrench,
  Activity,
  Mail,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/tools", icon: Wrench, label: "Tools" },
  { href: "/executions", icon: Activity, label: "Logs" },
  { href: "/contact", icon: Mail, label: "Contact" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-sidebar border-t border-sidebar-border md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map((item) => {
        const isActive = location === item.href || location.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={cn(
                "flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-150 cursor-pointer",
                isActive ? "text-primary" : "text-muted-foreground hover:text-sidebar-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-6 rounded-full transition-all duration-150",
                isActive ? "bg-primary/15" : "bg-transparent"
              )}>
                <item.icon className="w-4.5 h-4.5" />
              </div>
              <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
