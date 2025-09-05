import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }){
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  const submit = async (e)=>{
    e.preventDefault();
    setErr("");
    try{
      const { data } = await api.post("/auth/login", { email, password });
      onLogin(data.token);
    }catch(e){ setErr(e.response?.data?.error || "Login failed"); }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn w-full">Sign in</button>
      </form>
    </div>
  );
}