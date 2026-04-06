import { Link, useLocation } from "wouter";
import { LayoutDashboard, Bot, ListTodo, Wrench, Activity, LogOut } from "lucide-react";
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
    <div style={{width:"220px",minHeight:"100vh",background:"#1e1e2e",padding:"20px 0",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"0 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <h1 style={{color:"white",fontSize:"18px",fontWeight:"bold",margin:0}}>Agentpack</h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"4px 0 0"}}>Protocol</p>
      </div>
      <nav style={{flex:1,padding:"16px 0"}}>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = location === item.href || (item.href === "/dashboard" && location === "/");
          return (
            <Link key={item.name} href={item.href}>
              <a style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 20px",color:active?"white":"rgba(255,255,255,0.6)",background:active?"rgba(255,255,255,0.1)":"transparent",textDecoration:"none",fontSize:"14px",cursor:"pointer"}}>
                <Icon size={18}/>{item.name}
              </a>
            </Link>
          );
        })}
      </nav>
      <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
        {user && <p style={{color:"rgba(255,255,255,0.4)",fontSize:"12px",margin:"0 0 8px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user}</p>}
        <button onClick={handleLogout}
          style={{display:"flex",alignItems:"center",gap:"8px",color:"rgba(255,100,100,0.8)",background:"transparent",border:"none",cursor:"pointer",fontSize:"14px",padding:"4px 0",width:"100%"}}>
          <LogOut size={16}/>Sign Out
        </button>
      </div>
    </div>
  );
}
