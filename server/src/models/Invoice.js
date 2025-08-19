import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  description: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
  rate: { type: Number, default: 0 },
  amount: { type: Number, default: 0 }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, default: "" },
  items: { type: [ItemSchema], default: [] },
  tax: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Invoice", InvoiceSchema);
