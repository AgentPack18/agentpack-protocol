import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState, createContext, useContext } from "react";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import AgentNew from "@/pages/AgentNew";
import AgentDetail from "@/pages/AgentDetail";
import Tasks from "@/pages/Tasks";
import TaskNew from "@/pages/TaskNew";
import Tools from "@/pages/Tools";
import ToolNew from "@/pages/ToolNew";
import Executions from "@/pages/Executions";
import ExecutionDetail from "@/pages/ExecutionDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

const AuthContext = createContext<{user:string|null,login:(u:string,p:string)=>boolean,logout:()=>void}>({user:null,login:()=>false,logout:()=>{}});
export const useAuth = () => useContext(AuthContext);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true } },
});

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (isRegister && !name) { setError("Full name is required"); return; }
    const ok = login(email, password);
    if (ok) setLocation("/dashboard");
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"64px",height:"64px",background:"linear-gradient(135deg,#7c5cbf,#4f8ef7)",borderRadius:"16px",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:"16px",boxShadow:"0 8px 32px rgba(124,92,191,0.4)"}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{color:"white",fontSize:"28px",fontWeight:"700",margin:"0 0 4px"}}>Agentpack Protocol</h1>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"14px",margin:0}}>AI Agent Orchestration Platform</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",borderRadius:"20px",padding:"32px",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
          <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:"12px",padding:"4px",marginBottom:"24px"}}>
            <button onClick={()=>setIsRegister(false)}
              style={{flex:1,padding:"10px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:"600",transition:"all 0.2s",
                background:!isRegister?"rgba(124,92,191,0.8)":"transparent",
                color:!isRegister?"white":"rgba(255,255,255,0.5)"}}>
              Sign In
            </button>
            <button onClick={()=>setIsRegister(true)}
              style={{flex:1,padding:"10px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:"600",transition:"all 0.2s",
                background:isRegister?"rgba(124,92,191,0.8)":"transparent",
                color:isRegister?"white":"rgba(255,255,255,0.5)"}}>
              Sign Up
            </button>
          </div>

          <h2 style={{color:"white",fontSize:"20px",fontWeight:"600",margin:"0 0 6px"}}>
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",margin:"0 0 24px"}}>
            {isRegister ? "Sign up to start managing your AI agents" : "Sign in to your Agentpack Protocol account"}
          </p>

          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {isRegister && (
              <div>
                <label style={{color:"rgba(255,255,255,0.6)",fontSize:"12px",fontWeight:"600",display:"block",marginBottom:"6px",letterSpacing:"0.5px"}}>FULL NAME</label>
                <input type="text" placeholder="Enter your full name" value={name} onChange={e=>setName(e.target.value)}
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"white",fontSize:"14px",boxSizing:"border-box",outline:"none"}}/>
              </div>
            )}
            <div>
              <label style={{color:"rgba(255,255,255,0.6)",fontSize:"12px",fontWeight:"600",display:"block",marginBottom:"6px",letterSpacing:"0.5px"}}>EMAIL ADDRESS</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}
                style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"white",fontSize:"14px",boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div>
              <label style={{color:"rgba(255,255,255,0.6)",fontSize:"12px",fontWeight:"600",display:"block",marginBottom:"6px",letterSpacing:"0.5px"}}>PASSWORD</label>
              <input type="password" placeholder="Minimum 6 characters" value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"white",fontSize:"14px",boxSizing:"border-box",outline:"none"}}/>
            </div>
          </div>

          {error && (
            <div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"8px",padding:"10px 14px",marginTop:"12px"}}>
              <p style={{color:"#f87171",fontSize:"13px",margin:0}}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleSubmit}
            style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#7c5cbf,#4f8ef7)",border:"none",borderRadius:"10px",color:"white",fontSize:"15px",cursor:"pointer",fontWeight:"700",marginTop:"20px",boxShadow:"0 4px 20px rgba(124,92,191,0.4)",letterSpacing:"0.3px"}}>
            {isRegister ? "🚀 Create Account" : "→ Sign In"}
          </button>

          <div style={{textAlign:"center",marginTop:"20px"}}>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:"12px",margin:"0 0 8px"}}>
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <span onClick={()=>setIsRegister(!isRegister)} style={{color:"#a78bfa",cursor:"pointer",marginLeft:"6px",fontWeight:"600"}}>
                {isRegister ? "Sign in here" : "Sign up for free"}
              </span>
            </p>
          </div>
        </div>

        <p style={{textAlign:"center",color:"rgba(255,255,255,0.2)",fontSize:"12px",marginTop:"24px"}}>
          © 2026 Agentpack Protocol. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({component:Component}:{component:React.ComponentType}) {
  const {user} = useAuth();
  if (!user) return <Redirect to="/sign-in"/>;
  return <Component/>;
}

function Router() {
  return (
    <Switch>
      <Route path="/sign-in" component={()=><AuthPage mode="login"/>}/>
      <Route path="/sign-up" component={()=><AuthPage mode="register"/>}/>
      <Route path="/" component={()=><Redirect to="/dashboard"/>}/>
      <Route path="/dashboard" component={()=><ProtectedRoute component={Dashboard}/>}/>
      <Route path="/agents/new" component={()=><ProtectedRoute component={AgentNew}/>}/>
      <Route path="/agents/:agentId" component={()=><ProtectedRoute component={AgentDetail}/>}/>
      <Route path="/agents" component={()=><ProtectedRoute component={Agents}/>}/>
      <Route path="/tasks/new" component={()=><ProtectedRoute component={TaskNew}/>}/>
      <Route path="/tasks" component={()=><ProtectedRoute component={Tasks}/>}/>
      <Route path="/tools/new" component={()=><ProtectedRoute component={ToolNew}/>}/>
      <Route path="/tools" component={()=><ProtectedRoute component={Tools}/>}/>
      <Route path="/executions/:executionId" component={()=><ProtectedRoute component={ExecutionDetail}/>}/>
      <Route path="/executions" component={()=><ProtectedRoute component={Executions}/>}/>
      <Route path="/contact" component={Contact}/>
      <Route component={NotFound}/>
    </Switch>
  );
}

function AuthProvider({children}:{children:React.ReactNode}) {
  const [user, setUser] = useState<string|null>(()=>localStorage.getItem("ap_user"));
  const login = (email:string, password:string) => {
    localStorage.setItem("ap_user", email);
    setUser(email);
    return true;
  };
  const logout = () => { localStorage.removeItem("ap_user"); setUser(null); };
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>;
}

export default function App() {
  return (
    <ThemeProvider>
      <WouterRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Router/>
              <Toaster/>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </WouterRouter>
    </ThemeProvider>
  );
}
