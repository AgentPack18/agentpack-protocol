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
import NotFound from "@/pages/not-found";
import Contact from "@/pages/Contact";

const AuthContext = createContext<{user:string|null,login:(u:string,p:string)=>boolean,logout:()=>void}>({user:null,login:()=>false,logout:()=>{}});
export const useAuth = () => useContext(AuthContext);

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true } } });

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    if (!email || !password) { setError("Email dan password wajib diisi"); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter"); return; }
    const ok = login(email, password);
    if (ok) setLocation("/dashboard");
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#0f0f1a"}}>
      <div style={{background:"#1e1e2e",padding:"40px",borderRadius:"12px",width:"320px",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
        <h1 style={{color:"white",margin:"0 0 8px",fontSize:"24px"}}>Agentpack</h1>
        <p style={{color:"rgba(255,255,255,0.5)",margin:"0 0 24px",fontSize:"14px"}}>{isRegister?"Buat akun baru":"Masuk ke akun Anda"}</p>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          style={{width:"100%",padding:"10px 12px",marginBottom:"12px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"white",fontSize:"14px",boxSizing:"border-box"}}/>
        <input type="password" placeholder="Password (min 6 karakter)" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
          style={{width:"100%",padding:"10px 12px",marginBottom:"16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"white",fontSize:"14px",boxSizing:"border-box"}}/>
        {error&&<p style={{color:"#ff6b6b",fontSize:"13px",margin:"0 0 12px"}}>{error}</p>}
        <button onClick={handleSubmit}
          style={{width:"100%",padding:"12px",background:"#7c5cbf",border:"none",borderRadius:"8px",color:"white",fontSize:"14px",cursor:"pointer",fontWeight:"bold"}}>
          {isRegister?"Daftar":"Masuk"}
        </button>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",textAlign:"center",margin:"16px 0 0"}}>
          {isRegister?"Sudah punya akun? ":"Belum punya akun? "}
          <span onClick={()=>{setIsRegister(!isRegister);setError("");}} style={{color:"#7c5cbf",cursor:"pointer"}}>
            {isRegister?"Masuk":"Daftar"}
          </span>
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
      <Route path="/sign-in" component={LoginPage}/>
      <Route path="/sign-up" component={LoginPage}/>
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
