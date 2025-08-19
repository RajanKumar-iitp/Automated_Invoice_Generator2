# Automated_Invoice_Generator

## MERN Invoice Generator (Automated Invoice Generator - Project #33)

This repository contains a **MERN project** that allows users to create invoices, generate **PDF files** using `pdfkit`, store invoice records in **MongoDB**, and automatically send invoices as **PDF email attachments** using `nodemailer`.

The project matches the features described in Project #33 from the assignment list:
- Client information
- Itemized services with quantity and price
- Automatic tax (GST) calculation
- Totals and payment status
- PDF invoice generation
- Email sending (via Mailtrap Sandbox or Gmail App Passwords)

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas cluster)
- **Mailtrap Sandbox** account (recommended during development) or Gmail App Password for real-world email sending

### 🖥️ Server Setup
```bash
cd server
cp .env.example .env
# edit .env to set EMAIL_USER and EMAIL_PASS (or SMTP credentials)
npm install
npm run dev
```

### Example .env file
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/invoices
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=<your-mailtrap-username>
EMAIL_PASS=<your-mailtrap-password> ```
```
### Example .env file
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/invoices
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=<your-mailtrap-username>
EMAIL_PASS=<your-mailtrap-password>
```
💻 Client Setup
```
cd client
npm install
npm run dev
Open the client at: http://localhost:5173
Server runs at: http://localhost:5000
```
📧 Email Notes
```Mailtrap (safe for testing): Use provided SMTP credentials from your Mailtrap account. Emails won’t reach real inboxes but can be previewed inside Mailtrap.

Gmail (real sending): Enable 2FA, generate an App Password, and use it as EMAIL_PASS in your .env.
```
🔗 API Endpoints
```
POST /api/invoices → Create a new invoice, generate PDF, and send via email

GET /api/invoices/:id → Fetch a specific invoice document from MongoDB

GET /api/invoices/:id/pdf → Download invoice PDF (without sending email)
```
✨ Features
```
Dynamic React.js form for client and item details

Automatic GST and total calculation

Store invoice records in MongoDB

Generate clean, professional PDFs using pdfkit

Email invoices directly to clients via nodemailer

Separate frontend & backend folders for clean project structure
```
📂 Folder Structure
```
Automated_Invoice_Generator/
│
├── client/              # React + Vite frontend
│   └── src/
│       └── components/  # Invoice form components
│
├── server/              # Node.js + Express backend
│   └── src/
│       ├── models/      # Mongoose models
│       ├── routes/      # API routes
│       └── utils/       # PDF + email utilities
│
└── README.md            # Project documentation
```
📘 Learnings
```
Hands-on MERN stack project

Integrated pdfkit for server-side PDF generation

Used Mailtrap Sandbox for safe email testing

Debugged SMTP and PDF streaming issues

Built a complete end-to-end automation flow (frontend → backend → database → email)
```

🔮 Future Improvements
```
Dashboard to manage multiple clients and invoices

Online payment gateway integration

Invoice history export and analytics

Multi-currency & multi-language support
```
