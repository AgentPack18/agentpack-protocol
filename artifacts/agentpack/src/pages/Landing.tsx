import { Link } from "wouter";
import { AgentpackLogo } from "@/components/AgentpackLogo";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Zap, Shield, Activity, Bot } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Agent Fleet Management",
    desc: "Deploy and monitor multiple AI agents with real-time status tracking and performance metrics.",
  },
  {
    icon: Zap,
    title: "Task Orchestration",
    desc: "Assign tasks to specialized agents, track progress, and manage workflows at scale.",
  },
  {
    icon: Activity,
    title: "Execution Monitoring",
    desc: "Full visibility into every agent run — logs, token usage, duration, and success rates.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    desc: "Enterprise-grade authentication ensures only authorized users can access your agent infrastructure.",
  },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <AgentpackLogo size={34} />
          <div>
            <div className="text-sm font-bold tracking-tight text-foreground leading-none">Agentpack</div>
            <div
              className="text-[9px] font-semibold tracking-[0.2em] uppercase"
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
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/70 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
          <Link href="/sign-in">
            <button className="px-4 py-1.5 text-sm font-medium text-foreground border border-border rounded-md hover:bg-muted transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-4 py-1.5 text-sm font-medium text-primary-foreground rounded-md transition-colors"
              style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6">
          <AgentpackLogo size={72} className="mx-auto mb-4" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI Orchestration Platform
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground max-w-2xl leading-tight mb-4">
          Command your{" "}
          <span style={{
            background: "linear-gradient(90deg,#6366f1,#3b82f6,#06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            AI Agent Fleet
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mb-8">
          Agentpack Protocol is a mission-control platform for deploying, monitoring, and orchestrating AI agents at scale — all in one unified dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/sign-up">
            <button className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6,#06b6d4)" }}
            >
              Create Free Account
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="px-6 py-3 text-sm font-semibold text-foreground rounded-lg border border-border hover:bg-muted transition-colors">
              Sign In to Dashboard
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full text-left">
          {features.map((f) => (
            <div key={f.title} className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg mb-3"
                style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
              >
                <f.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="flex flex-col items-center gap-3 py-5 text-xs text-muted-foreground border-t border-border">
        <a
          href="https://orynth.dev/projects/agentpack-protocol"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://orynth.dev/api/badge/agentpack-protocol?theme=${theme}&style=default`}
            alt="Featured on Orynth"
            width={260}
            height={80}
          />
        </a>
        <span>© 2026 Agentpack Protocol. Built for AI-native teams.</span>
      </footer>
    </div>
  );
}
