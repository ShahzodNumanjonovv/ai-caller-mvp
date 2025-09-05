import { useState } from "react";
import { api } from "../api";

export default function SellerForm(){
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [ok,setOk]=useState("");

  const submit = async ()=>{
    const { data } = await api.post("/sellers", { name, phone });
    setOk(`Saved seller ${data.phone}`);
    setName(""); setPhone("");
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <label className="label">Phone (E.164, e.g. +998XX...)</label>
        <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
      </div>
      <button className="btn" onClick={submit}>Save Seller</button>
      {ok && <div className="text-green-600 text-sm">{ok}</div>}
    </div>
  );
}