import React, { useState } from "react";
import axios from "axios";

export default function InvoiceForm(){
  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    tax: 0, status: "Pending"
  });
  const [loading, setLoading] = useState(false);

  function updateItem(idx, field, value){
    const items = [...form.items];
    items[idx][field] = field === "description" ? value : Number(value || 0);
    items[idx].amount = Number(items[idx].quantity) * Number(items[idx].rate);
    setForm({...form, items});
  }

  function addItem(){
    setForm({...form, items: [...form.items, { description: "", quantity: 1, rate: 0, amount: 0 }]});
  }

  function removeItem(idx){
    const items = form.items.filter((_,i)=>i!==idx);
    setForm({...form, items});
  }

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/api/invoices`, form);
      alert("✅ Invoice created, PDF generated & emailed!");
      setForm({ clientName: "", clientEmail: "", clientPhone: "", items: [{ description: "", quantity: 1, rate: 0, amount: 0 }], tax:0, status:"Pending" });
    }catch(err){
      console.error(err);
      alert("Error: " + (err.response?.data?.error || err.message));
    }finally{
      setLoading(false);
    }
  }

  const subtotal = form.items.reduce((s,i)=>s + (Number(i.amount)||0), 0);
  const total = subtotal + subtotal * (Number(form.tax||0)/100);

  return (
    <form onSubmit={submit}>
      <h3>Client</h3>
      <input required placeholder="Client name" value={form.clientName} onChange={e=>setForm({...form, clientName:e.target.value})} />
      <input required placeholder="Client email" value={form.clientEmail} onChange={e=>setForm({...form, clientEmail:e.target.value})} />
      <input placeholder="Client phone" value={form.clientPhone} onChange={e=>setForm({...form, clientPhone:e.target.value})} />

      <h3 style={{marginTop:12}}>Items</h3>
      {form.items.map((it,idx)=>(
        <div className="item-row" key={idx}>
          <input placeholder="Description" value={it.description} onChange={e=>updateItem(idx,"description", e.target.value)} />
          <input type="number" min="1" value={it.quantity} onChange={e=>updateItem(idx,"quantity", e.target.value)} />
          <input type="number" step="0.01" value={it.rate} onChange={e=>updateItem(idx,"rate", e.target.value)} />
          <input readOnly value={it.amount.toFixed(2)} />
          <button type="button" onClick={()=>removeItem(idx)} style={{background:"#ef4444"}}>Del</button>
        </div>
      ))}
      <div style={{marginTop:8}}><button type="button" onClick={addItem}>+ Add Item</button></div>

      <h3 style={{marginTop:12}}>Totals</h3>
      <div className="small">Subtotal: {subtotal.toFixed(2)}</div>
      <div style={{marginTop:6}}>
        <label className="small">Tax (%)</label>
        <input type="number" value={form.tax} onChange={e=>setForm({...form, tax:Number(e.target.value||0)})} />
      </div>
      <div className="small" style={{marginTop:6}}>Total: {total.toFixed(2)}</div>

      <div style={{marginTop:12}}>
        <label className="small">Status</label>
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option>Pending</option>
          <option>Paid</option>
        </select>
      </div>

      <div style={{marginTop:12}}>
        <button disabled={loading} type="submit">{loading ? "Sending..." : "Generate & Send Invoice"}</button>
      </div>
    </form>
  );
}
