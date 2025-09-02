import { useEffect, useState } from "react";
import UploadCSV from "../components/UploadCSV.jsx";
import SellerForm from "../components/SellerForm.jsx";
import Controls from "../components/Controls.jsx";
import LogTable from "../components/LogTable.jsx";
import { api } from "../api";
import { socket } from "../sockets";

export default function Dashboard({ onLogout }){
  const [leads, setLeads] = useState([]);
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState({ running:false, busy:false });

  const load = async ()=>{
    const { data } = await api.get("/leads");
    setLeads(data);
    const st = await api.get("/campaign/state");
    setState(st.data);
  };

  useEffect(()=>{ load(); }, []);
  useEffect(()=>{
    socket.on("log", (msg)=> setLogs(prev => [{...msg}, ...prev].slice(0,200)));
    return ()=> socket.off("log");
  },[]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Caller MVP</h1>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Upload Leads (CSV: only phone column)</h2>
          <UploadCSV onDone={load}/>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add Seller</h2>
          <SellerForm/>
        </div>
      </div>

      <div className="card">
        <Controls running={state.running} busy={state.busy}
          onStart={async()=>{ await api.post("/campaign/start"); setState({ ...state, running:true }); }}
          onStop={async()=>{ await api.post("/campaign/stop"); setState({ ...state, running:false }); }}
          onRefresh={load}
          onReset={async()=>{ await api.delete("/leads/reset"); load(); }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Live Logs</h2>
          <LogTable logs={logs}/>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th>Phone</th><th>Status</th><th>Tries</th></tr></thead>
              <tbody>
                {leads.map(l=>(
                  <tr key={l._id} className="border-t"><td>{l.phone}</td><td>{l.status}</td><td>{l.tries}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}