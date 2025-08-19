import React from "react";
import InvoiceForm from "./components/InvoiceForm";

export default function App(){
  return (
    <div className="container">
      <h1>MERN — Automated Invoice Generator</h1>
      <div className="grid">
        <div className="card"><InvoiceForm /></div>
        <div className="card">
          <h3 className="small">Instructions</h3>
          <ol>
            <li>Fill client details and items.</li>
            <li>Click <strong>Generate & Send</strong> to save, create PDF, and email.</li>
            <li>Use Mailtrap for safe testing or Gmail App Password for real emails.</li>
          </ol>
          <p className="small">Server must be running at <code>http://localhost:5000</code></p>
        </div>
      </div>
    </div>
  );
}
