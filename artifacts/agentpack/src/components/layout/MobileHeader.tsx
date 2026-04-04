import { Sun, Moon } from "lucide-react";
import { AgentpackLogo } from "@/components/AgentpackLogo";
import { useTheme } from "@/components/ThemeProvider";

export function MobileHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border md:hidden"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
    >
      <div className="flex items-center gap-2.5">
        <AgentpackLogo size={30} />
        <div>
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground leading-none">
            Agentpack
          </div>
          <div
            className="text-[9px] font-semibold tracking-[0.2em] uppercase"
            style={{
              background: "linear-gradient(90deg, #6366f1, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Protocol
          </div>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500" />
        )}
      </button>
    </header>
  );
}
