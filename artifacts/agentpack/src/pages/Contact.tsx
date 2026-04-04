import { Layout } from "@/components/layout/Layout";
import { Github, Mail, MessageCircle } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  {
    id: "x",
    label: "Follow on X",
    handle: "@Agent_pack",
    url: "https://x.com/Agent_pack",
    description: "Stay updated with the latest news, announcements, and AI agent insights.",
    icon: XIcon,
    gradient: "from-zinc-800 to-zinc-950",
    darkGradient: "from-zinc-700 to-zinc-900",
    iconColor: "text-white",
    badge: {
      bg: "bg-zinc-900 dark:bg-zinc-800",
      border: "border-zinc-700",
      text: "text-zinc-100",
      dot: "bg-zinc-400",
    },
  },
  {
    id: "github",
    label: "Star on GitHub",
    handle: "AgentPack18 / Agentpack_protocol",
    url: "https://github.com/AgentPack18/Agentpack_protocol",
    description: "Explore the source code, report issues, contribute, and follow the project's progress.",
    icon: Github,
    gradient: "from-violet-600 to-indigo-700",
    darkGradient: "from-violet-700 to-indigo-800",
    iconColor: "text-white",
    badge: {
      bg: "bg-indigo-50 dark:bg-indigo-950",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-700 dark:text-indigo-300",
      dot: "bg-indigo-400",
    },
  },
];

export default function Contact() {
  return (
    <Layout>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground mt-1">
            Connect with the Agentpack Protocol team and community.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Card header strip */}
              <div className={`bg-gradient-to-br ${social.gradient} px-5 py-5 flex items-center gap-3`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
                  <social.icon className={`w-5 h-5 ${social.iconColor}`} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm leading-none">{social.label}</div>
                  <div className="text-white/70 text-xs mt-0.5">{social.handle}</div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {social.description}
                </p>
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${social.badge.bg} ${social.badge.border} ${social.badge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${social.badge.dot}`} />
                  Visit profile
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Email contact */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
          >
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">General Inquiries</div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              For partnerships, enterprise inquiries, or feedback — reach out via our social channels above or open an issue on GitHub.
            </p>
          </div>
        </div>

        {/* Community note */}
        <div className="mt-5 rounded-xl bg-primary/5 border border-primary/15 px-5 py-4 flex items-start gap-3">
          <MessageCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agentpack Protocol is open to the community. Feature requests, bug reports, and contributions are always welcome on{" "}
            <a href="https://github.com/AgentPack18/Agentpack_protocol" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
              GitHub
            </a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
