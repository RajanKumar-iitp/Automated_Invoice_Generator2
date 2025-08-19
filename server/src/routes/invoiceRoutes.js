import express from "express";
import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = process.env.TEMP_DIR || path.join(__dirname, "..", "..", "tmp");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

/**
 * Helper: Generate PDF from invoice and save to file
 */
function generateInvoicePDF(invoice, filepath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      // Client
      doc.fontSize(14).text("Bill To:");
      doc.fontSize(12).text(invoice.clientName);
      doc.text(invoice.clientEmail);
      if (invoice.clientPhone) doc.text(invoice.clientPhone);
      doc.moveDown();

      // Items Table
      doc.fontSize(12).text("Description", 50, doc.y, { continued: true });
      doc.text("Qty", 330, doc.y, { width: 50, continued: true });
      doc.text("Rate", 380, doc.y, { width: 70, continued: true });
      doc.text("Amount", 460, doc.y);
      doc.moveDown();

      invoice.items.forEach(item => {
        doc.text(item.description, 50, doc.y, { continued: true });
        doc.text(String(item.quantity), 330, doc.y, { width: 50, continued: true });
        doc.text(item.rate.toFixed(2), 380, doc.y, { width: 70, continued: true });
        doc.text(item.amount.toFixed(2), 460, doc.y);
        doc.moveDown();
      });

      doc.moveDown();
      doc.text(`Subtotal: ${invoice.subtotal.toFixed(2)}`, { align: "right" });
      doc.text(`Tax (${invoice.tax}%): ${(invoice.total - invoice.subtotal).toFixed(2)}`, { align: "right" });
      doc.text(`Total: ${invoice.total.toFixed(2)}`, { align: "right" });
      doc.moveDown();
      doc.text(`Status: ${invoice.status}`, { align: "right" });

      doc.end();
      stream.on("finish", () => resolve(true));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Nodemailer transporter (Mailtrap or Gmail)
 */
function createTransporter() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
}

/**
 * Route: Create invoice → save DB → generate PDF → send via email
 */
router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, items = [], tax = 0, status = "Pending" } = req.body;

    // Calculate subtotal & total
    let subtotal = 0;
    const normalizedItems = (items || []).map(i => {
      const qty = Number(i.quantity) || 0;
      const rate = Number(i.rate) || 0;
      const amount = qty * rate;
      subtotal += amount;
      return { description: i.description || "", quantity: qty, rate, amount };
    });

    const total = subtotal + (subtotal * (Number(tax) / 100));

    // Save invoice to MongoDB
    const invoice = await Invoice.create({
      clientName,
      clientEmail,
      clientPhone,
      items: normalizedItems,
      tax: Number(tax),
      subtotal,
      total,
      status,
    });

    // Generate PDF file
    const filename = `invoice_${invoice._id}.pdf`;
    const filepath = path.join(TEMP_DIR, filename);
    await generateInvoicePDF(invoice.toObject(), filepath);

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Invoice ${invoice._id}`,
      text: `Hello ${invoice.clientName},\n\nPlease find attached your invoice.\n\nThanks.`,
      attachments: [{ filename, path: filepath }],
    };

    await transporter.sendMail(mailOptions);

    // Cleanup temp file
    fs.unlink(filepath, err => {
      if (err) console.warn("Temp file cleanup error:", err.message);
    });

    res.json({ ok: true, invoice });
  } catch (err) {
    console.error("Invoice creation failed:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/**
 * Route: Fetch invoice JSON
 */
router.get("/:id", async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });
    res.json(inv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Route: Download PDF directly (without sending email)
 */
router.get("/:id/pdf", async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${inv._id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Same invoice rendering as above
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${inv._id}`);
    doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Bill To:");
    doc.fontSize(12).text(inv.clientName);
    doc.text(inv.clientEmail);
    if (inv.clientPhone) doc.text(inv.clientPhone);
    doc.moveDown();

    doc.fontSize(12).text("Description", 50, doc.y, { continued: true });
    doc.text("Qty", 330, doc.y, { width: 50, continued: true });
    doc.text("Rate", 380, doc.y, { width: 70, continued: true });
    doc.text("Amount", 460, doc.y);
    doc.moveDown();

    inv.items.forEach(item => {
      doc.text(item.description, 50, doc.y, { continued: true });
      doc.text(String(item.quantity), 330, doc.y, { width: 50, continued: true });
      doc.text(item.rate.toFixed(2), 380, doc.y, { width: 70, continued: true });
      doc.text(item.amount.toFixed(2), 460, doc.y);
      doc.moveDown();
    });

    doc.moveDown();
    doc.text(`Subtotal: ${inv.subtotal.toFixed(2)}`, { align: "right" });
    doc.text(`Tax (${inv.tax}%): ${(inv.total - inv.subtotal).toFixed(2)}`, { align: "right" });
    doc.text(`Total: ${inv.total.toFixed(2)}`, { align: "right" });
    doc.moveDown();
    doc.text(`Status: ${inv.status}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("PDF download failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
