import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { setToken } from "./api";

export default function App(){
  const [token, setTok] = useState(localStorage.getItem("token"));
  useEffect(()=> { if(token) setToken(token); }, [token]);
  return token
    ? <Dashboard onLogout={()=>{localStorage.removeItem("token"); setTok(null);}}/>
    : <Login onLogin={(t)=>{localStorage.setItem("token", t); setTok(t);}}/>;
}