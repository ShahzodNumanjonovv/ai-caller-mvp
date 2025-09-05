import { useState } from "react";
import { api } from "../api";

export default function UploadCSV({ onDone }){
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const upload = async ()=>{
    if(!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("/leads/csv", fd);
    setMsg(`Inserted ${data.inserted} leads`);
    onDone?.();
  };
  return (
    <div className="space-y-3">
      <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])}/>
      <button className="btn" onClick={upload}>Upload</button>
      {msg && <div className="text-green-600 text-sm">{msg}</div>}
    </div>
  );
}