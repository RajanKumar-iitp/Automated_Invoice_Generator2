# Automated_Invoice_Generator

# MERN Invoice Generator (Automated Invoice Generator - Project #33)

This repository contains a simple MERN project to create invoices, generate PDF files using **pdfkit**, store invoice records in MongoDB, and **email** the invoice as a PDF attachment using **nodemailer**.
The code matches the features described in Project #33 from your assignment list: client info, itemized services, taxes, totals, payment status, PDF generation, and email sending.

## Quick setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- (Optional) Mail testing: Mailtrap (recommended during development) or Gmail App Password for real emails

### Server
```bash
cd server
cp .env.example .env
# edit .env to set EMAIL_USER and EMAIL_PASS (or SMTP credentials)
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

Open the client at `http://localhost:5173` and the server at `http://localhost:5000`.

### Email notes
- For real email sending via Gmail: enable 2FA and create an **App Password** and use it as `EMAIL_PASS`.
- For safe testing, use Mailtrap and set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` in the `.env`.

## API
- `POST /api/invoices` → create invoice, generate PDF, and send email attachment.
- `GET /api/invoices/:id` → fetch invoice document
- `GET /api/invoices/:id/pdf` → download PDF (no email)

## Files
- server/src: Express backend, Mongoose model, routes
- client/src: React + Vite frontend (Invoice form)

Enjoy — modify and extend as needed.
