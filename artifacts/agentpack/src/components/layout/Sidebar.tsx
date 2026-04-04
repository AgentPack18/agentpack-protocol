import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  Wrench,
  Activity,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Mail,
} from "lucide-react";
import { AgentpackLogo } from "@/components/AgentpackLogo";
import { useTheme } from "@/components/ThemeProvider";
import { useClerk, useUser } from "@clerk/react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/tools", icon: Wrench, label: "Tools" },
  { href: "/executions", icon: Activity, label: "Executions" },
  { href: "/contact", icon: Mail, label: "Contact Us" },
];

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const displayName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "User";
  const email = user.emailAddresses[0]?.emailAddress;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
        >
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs font-semibold text-sidebar-foreground truncate leading-none">{displayName}</div>
          {email && <div className="text-[10px] text-muted-foreground truncate mt-0.5">{email}</div>}
        </div>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-popover border border-popover-border rounded-lg shadow-lg overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <div className="text-xs font-semibold text-foreground truncate">{displayName}</div>
              {email && <div className="text-[10px] text-muted-foreground truncate">{email}</div>}
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <AgentpackLogo size={38} />
        <div>
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground leading-none">Agentpack</div>
          <div
            className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5"
            style={{
              background: "linear-gradient(90deg,#6366f1,#3b82f6,#06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Protocol
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 py-1.5 mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Navigation</span>
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span
            className="relative w-8 h-4 rounded-full flex items-center transition-colors duration-300"
            style={{
              background: theme === "dark"
                ? "linear-gradient(90deg,#6366f1,#3b82f6)"
                : "linear-gradient(90deg,#f59e0b,#f97316)",
            }}
          >
            <span
              className="absolute w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300"
              style={{ left: theme === "dark" ? "calc(100% - 14px)" : "2px" }}
            />
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            {theme === "dark"
              ? <><Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark mode</>
              : <><Sun className="w-3.5 h-3.5 text-amber-400" /> Light mode</>
            }
          </span>
        </button>

        {/* Status */}
        <div className="flex items-center gap-2 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">All systems operational</span>
        </div>

        {/* User menu */}
        <div className="pt-1">
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}
