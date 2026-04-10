import puppeteer from "puppeteer";
import type { Invoice, InvoiceItem } from "../db/schema.js";
import { formatCurrency } from "./currency.js";

export interface InvoiceWithItems extends Omit<Invoice, "items"> {
  id: string;
  items: InvoiceItem[];
}

function buildImprovedInvoiceHTML(invoice: InvoiceWithItems): string {
  const currency = (amount: number) => formatCurrency(amount, invoice.currencySymbol || "₹", invoice.currency || "INR");

  const rows = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${item.description}</div>
          ${item.category ? `<div style="display: inline-block; margin-top: 4px; padding: 4px 8px; background: #e3f2fd; color: #065f46; border-radius: 4px; font-size: 10px;">${item.category}</div>` : ""}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${currency(item.unitPrice)}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 600;">${currency(item.total)}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.invoiceNumber} - ZERO OPS</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #1a1a1a;
        background: #ffffff;
        line-height: 1.5;
      }
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f8f9fa;
      }
      .brand {
        flex: 1;
      }
      .brand h1 {
        font-size: 28px;
        font-weight: 700;
        color: #2563eb;
        margin: 0 0 8px 0;
      }
      .brand .tagline {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
      .meta {
        text-align: right;
        flex: 1;
      }
      .meta .invoice-number {
        font-size: 20px;
        font-weight: 700;
        color: #2563eb;
      }
      .meta .dates {
        font-size: 13px;
        color: #6b7280;
        margin-top: 8px;
      }
      .client-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
      }
      .info-section h3 {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 12px 0;
      }
      .info-section p {
        margin: 0;
        line-height: 1.6;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
        background: #ffffff;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .items-table th {
        background: #374151;
        color: #ffffff;
        font-weight: 600;
        text-align: left;
        padding: 16px 12px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .items-table td {
        padding: 16px 12px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 14px;
        vertical-align: top;
      }
      .totals-section {
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .total-row:last-child {
        border-bottom: none;
        background: #374151;
        color: #ffffff;
      }
      .total-label {
        font-size: 14px;
        color: #6b7280;
      }
      .total-amount {
        font-size: 18px;
        font-weight: 700;
        color: #374151;
      }
      .payment-info {
        margin: 30px 0;
        padding: 20px;
        background: #fef3c7;
        border-radius: 6px;
        border-left: 4px solid #10b981;
      }
      .payment-info h3 {
        font-size: 14px;
        font-weight: 600;
        color: #92400e;
        margin: 0 0 12px 0;
      }
      .payment-info p {
        margin: 0;
        line-height: 1.6;
      }
      .signature-section {
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
      }
      .signature-section h3 {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 12px 0;
      }
      .signature-box {
        border: 2px dashed #d1d5db;
        border-radius: 4px;
        padding: 20px;
        margin: 12px 0;
        background: #fafafa;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: italic;
        color: #6b7280;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      @media print {
        body { font-size: 12px; }
        .invoice-container { box-shadow: none; border: 1px solid #000; }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <div class="brand">
          <h1>ZERO OPS</h1>
          <div class="tagline">Business Automation Systems</div>
        </div>
        <div class="meta">
          <div class="invoice-number">Invoice #${invoice.invoiceNumber}</div>
          <div class="dates">
            <div><strong>Issued:</strong> ${new Date(invoice.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Due:</strong> ${new Date(invoice.dueDate).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div class="client-info">
        <div class="info-section">
          <h3>From</h3>
          <p><strong>ZERO Business Automation Systems</strong></p>
          <p>Bengaluru, Karnataka</p>
          <p>Email: zerohub01@gmail.com</p>
          <p>Phone: +91 97469 27368</p>
        </div>
        <div class="info-section">
          <h3>Bill To</h3>
          <p><strong>${invoice.clientName}</strong></p>
          <p>${invoice.clientBusiness}</p>
          <p>${invoice.clientEmail}</p>
          <p>${invoice.clientPhone}</p>
          ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ""}
          ${invoice.clientGST ? `<p><strong>GST:</strong> ${invoice.clientGST}</p>` : ""}
        </div>
      </div>

      ${invoice.proposalNote ? `
      <div class="payment-info">
        <h3>Proposal Note</h3>
        <p>${invoice.proposalNote}</p>
      </div>
      ` : ""}

      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 40%;">Description</th>
            <th style="width: 15%;">Quantity</th>
            <th style="width: 20%;">Unit Price</th>
            <th style="width: 25%;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span class="total-label">Subtotal</span>
          <span class="total-amount">${currency(invoice.subtotal)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">${invoice.currency === "INR" ? "GST" : "Tax"} (${invoice.gstRate}%)</span>
          <span class="total-amount">${currency(invoice.gstAmount)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">Total Amount</span>
          <span class="total-amount">${currency(invoice.totalAmount)}</span>
        </div>
      </div>

      <div class="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
        <p><strong>UPI:</strong> ${invoice.upiId || "zerohub01@upi"}</p>
        <p><strong>Bank:</strong> ${invoice.bankName || "Bank Name"}</p>
        <p><strong>Account:</strong> ${invoice.accountNumber || "Account Number"}</p>
        <p><strong>IFSC:</strong> ${invoice.ifscCode || "IFSC Code"}</p>
      </div>

      <div class="signature-section">
        <h3>Signatures</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="signature-box">
            <div style="text-align: center; margin-bottom: 8px; font-size: 12px; color: #6b7280;">Client Signature</div>
            ${invoice.clientSignature ? `
              <div style="font-size: 16px; color: #1a1a1a;">${invoice.clientSignature}</div>
            ` : '<div style="color: #9ca3af;">(Pending)</div>'}
          </div>
          <div class="signature-box">
            <div style="text-align: center; margin-bottom: 8px; font-size: 12px; color: #6b7280;">ZERO OPS Signature</div>
            ${invoice.adminSignature ? `
              <div style="font-size: 16px; color: #1a1a1a;">${invoice.adminSignature}</div>
            ` : '<div style="color: #9ca3af;">(Pending)</div>'}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business! | This is a computer-generated invoice.</p>
        <p>© ${new Date().getFullYear()} ZERO Business Automation Systems. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
}

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] as const;

async function launchPdfBrowser() {
  const executablePath = (process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH || "").trim();

  if (executablePath) {
    try {
      return await puppeteer.launch({
        headless: true,
        args: [...launchArgs],
        executablePath
      });
    } catch (error) {
      console.warn(`[PDF] Failed launching Chrome at "${executablePath}". Retrying with Puppeteer managed browser.`, error);
    }
  }

  return puppeteer.launch({
    headless: true,
    args: [...launchArgs]
  });
}

function isMissingChromeError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.toLowerCase().includes("could not find chrome");
}

export async function generateImprovedInvoicePDF(invoice: InvoiceWithItems): Promise<Buffer> {
  try {
    const browser = await launchPdfBrowser();
    try {
      const page = await browser.newPage();
      await page.setContent(buildImprovedInvoiceHTML(invoice), { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size:10px; color:#666; width:100%; text-align:center; padding:10px;">ZERO OPS - Invoice #' + currentPage + '</div>',
        footerTemplate: '<div style="font-size:10px; color:#666; width:100%; text-align:center; padding:10px;">Page ' + currentPage + ' of ' + totalPages + '</div>'
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  } catch (error) {
    if (isMissingChromeError(error)) {
      console.warn("[PDF] Invoice styled renderer unavailable (Chrome not installed). Falling back to simplified PDF.");
      const { generateSimplePdf } = await import("./simplePdf.js");
      return generateSimplePdf({
        title: "ZERO OPS - Invoice",
        subtitle: invoice.invoiceNumber || "",
        rows: [
          { label: "Invoice Number", value: invoice.invoiceNumber || "-" },
          { label: "Client Name", value: invoice.clientName || "-" },
          { label: "Client Email", value: invoice.clientEmail || "-" },
          { label: "Client Phone", value: invoice.clientPhone || "-" },
          { label: "Client Business", value: invoice.clientBusiness || "-" },
          { label: "Due Date", value: new Date(invoice.dueDate).toLocaleDateString("en-IN") },
          { label: "Subtotal", value: formatCurrency(Number(invoice.subtotal || 0), invoice.currencySymbol || "₹", invoice.currency || "INR") },
          { label: "Tax", value: `${Number(invoice.gstRate || 0)}%` },
          { label: "Total Amount", value: formatCurrency(Number(invoice.totalAmount || 0), invoice.currencySymbol || "₹", invoice.currency || "INR") },
          { label: "Payment Terms", value: invoice.paymentTerms || "-" }
        ],
        footerNote: "This is a simplified fallback PDF because high-fidelity renderer is temporarily unavailable."
      });
    } else {
      console.error("[PDF] Invoice styled PDF generation failed. Falling back to simplified PDF.", error);
      const { generateEmergencyPdf } = await import("./emergencyPdf.js");
      return generateEmergencyPdf("ZERO OPS - Invoice", [
        `Invoice Number: ${invoice.invoiceNumber || "-"}`,
        `Client Name: ${invoice.clientName || "-"}`,
        `Client Email: ${invoice.clientEmail || "-"}`,
        `Client Phone: ${invoice.clientPhone || "-"}`,
        `Client Business: ${invoice.clientBusiness || "-"}`,
        `Due Date: ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}`,
        `Total Amount: ${formatCurrency(Number(invoice.totalAmount || 0), invoice.currencySymbol || "₹", invoice.currency || "INR")}`,
        `Payment Terms: ${invoice.paymentTerms || "-"}`
      ]);
    }
  }
}
