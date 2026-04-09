import { Link, useLocation } from "wouter";
import { LayoutDashboard, Bot, ListTodo, Wrench, Activity, LogOut, User } from "lucide-react";
import { useAuth } from "@/App";

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Executions", href: "/executions", icon: Activity },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/sign-in");
  };

  return (
    <div style={{width:"220px",minHeight:"100vh",background:"#1e1e2e",padding:"0",display:"flex",flexDirection:"column",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{padding:"24px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"32px",height:"32px",background:"linear-gradient(135deg,#7c5cbf,#4f8ef7)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h1 style={{color:"white",fontSize:"14px",fontWeight:"700",margin:0,letterSpacing:"0.3px"}}>Agentpack</h1>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:"10px",margin:0,letterSpacing:"1px",textTransform:"uppercase"}}>Protocol</p>
          </div>
        </div>
      </div>

      <nav style={{flex:1,padding:"12px 8px"}}>
        <p style={{color:"rgba(255,255,255,0.25)",fontSize:"10px",fontWeight:"700",letterSpacing:"1.5px",textTransform:"uppercase",padding:"8px 12px 4px"}}>Navigation</p>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = location === item.href || (item.href === "/dashboard" && location === "/");
          return (
            <Link key={item.name} href={item.href}>
              <a style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",color:active?"white":"rgba(255,255,255,0.5)",background:active?"rgba(124,92,191,0.2)":"transparent",textDecoration:"none",fontSize:"13px",fontWeight:active?"600":"400",borderRadius:"8px",marginBottom:"2px",cursor:"pointer",borderLeft:active?"3px solid #7c5cbf":"3px solid transparent",transition:"all 0.15s"}}>
                <Icon size={16}/>{item.name}
              </a>
            </Link>
          );
        })}
      </nav>

      <div style={{padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",marginBottom:"4px"}}>
          <div style={{width:"28px",height:"28px",background:"rgba(124,92,191,0.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <User size={14} color="#a78bfa"/>
          </div>
          <div style={{flex:1,overflow:"hidden"}}>
            <p style={{color:"white",fontSize:"12px",fontWeight:"600",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name || user?.email?.split("@")[0]}</p>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:"10px",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{display:"flex",alignItems:"center",gap:"10px",color:"rgba(248,113,113,0.8)",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",cursor:"pointer",fontSize:"13px",padding:"9px 12px",width:"100%",borderRadius:"8px",fontWeight:"500"}}>
          <LogOut size={14}/>Sign Out
        </button>
      </div>
    </div>
  );
}
