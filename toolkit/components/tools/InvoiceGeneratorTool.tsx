"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { ToolInput, ToolTextarea, ToolButton } from "@/components/tools/ui";
import { downloadBlob } from "@/lib/utils";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorTool() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmt = sub * (taxRate / 100);
    return { subtotal: sub, tax: taxAmt, total: sub + taxAmt };
  }, [items, taxRate]);

  const addItem = () => {
    setItems((i) => [...i, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems((i) => i.filter((x) => x.id !== id));
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const downloadPdf = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", margin, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`#${invoiceNumber}`, 150, y);
    y += 10;
    doc.text(`Date: ${invoiceDate}`, 150, y);
    y += 5;
    if (dueDate) {
      y += 5;
      doc.text(`Due: ${dueDate}`, 150, y - 5);
    }

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("From:", margin, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    if (businessName) { doc.text(businessName, margin, y); y += 5; }
    if (businessAddress) {
      const lines = doc.splitTextToSize(businessAddress, 80);
      doc.text(lines, margin, y);
      y += lines.length * 5;
    }
    if (businessEmail) { doc.text(businessEmail, margin, y); y += 5; }

    let y2 = y - (businessAddress ? doc.splitTextToSize(businessAddress, 80).length * 5 : 0) - (businessName ? 5 : 0) - 5;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 110, y2);
    doc.setFont("helvetica", "normal");
    y2 += 5;
    if (clientName) { doc.text(clientName, 110, y2); y2 += 5; }
    if (clientAddress) {
      const lines = doc.splitTextToSize(clientAddress, 80);
      doc.text(lines, 110, y2);
      y2 += lines.length * 5;
    }
    if (clientEmail) { doc.text(clientEmail, 110, y2); }

    y = Math.max(y, y2) + 15;

    doc.setFont("helvetica", "bold");
    doc.text("Description", margin, y);
    doc.text("Qty", 110, y);
    doc.text("Rate", 130, y);
    doc.text("Amount", 160, y);
    y += 3;
    doc.line(margin, y, 190, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    for (const item of items.filter((i) => i.description)) {
      ensureSpace(10);
      const amount = item.quantity * item.rate;
      doc.text(item.description.slice(0, 40), margin, y);
      doc.text(String(item.quantity), 110, y);
      doc.text(formatCurrency(item.rate), 130, y);
      doc.text(formatCurrency(amount), 160, y);
      y += 7;
    }

    y += 5;
    ensureSpace(25);
    doc.text("Subtotal:", 130, y);
    doc.text(formatCurrency(subtotal), 160, y);
    y += 7;
    if (taxRate > 0) {
      doc.text(`Tax (${taxRate}%):`, 130, y);
      doc.text(formatCurrency(tax), 160, y);
      y += 7;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 130, y);
    doc.text(formatCurrency(total), 160, y);

    if (notes) {
      ensureSpace(20);
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const noteLines = doc.splitTextToSize(notes, 170);
      for (const line of noteLines) {
        ensureSpace(7);
        doc.text(line, margin, y);
        y += 5;
      }
    }

    downloadBlob(doc.output("blob"), `invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <ToolInput label="Invoice #" value={invoiceNumber} onChange={setInvoiceNumber} />
          <ToolInput label="Date" value={invoiceDate} onChange={setInvoiceDate} type="date" />
          <ToolInput label="Due Date" value={dueDate} onChange={setDueDate} type="date" />
        </div>

        <h3 className="font-medium text-gray-900">Your Business</h3>
        <ToolInput label="Business Name" value={businessName} onChange={setBusinessName} />
        <ToolTextarea label="Address" value={businessAddress} onChange={setBusinessAddress} rows={2} />
        <ToolInput label="Email" value={businessEmail} onChange={setBusinessEmail} />

        <h3 className="font-medium text-gray-900">Client</h3>
        <ToolInput label="Client Name" value={clientName} onChange={setClientName} />
        <ToolTextarea label="Address" value={clientAddress} onChange={setClientAddress} rows={2} />
        <ToolInput label="Email" value={clientEmail} onChange={setClientEmail} />

        <h3 className="font-medium text-gray-900">Line Items</h3>
        {items.map((item, idx) => (
          <div key={item.id} className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <ToolInput label="Description" value={item.description} onChange={(v) => {
                setItems((i) => i.map((x, j) => j === idx ? { ...x, description: v } : x));
              }} />
            </div>
            <ToolInput label="Qty" value={item.quantity} onChange={(v) => {
              setItems((i) => i.map((x, j) => j === idx ? { ...x, quantity: Number(v) || 0 } : x));
            }} type="number" min={0} />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <ToolInput label="Rate ($)" value={item.rate} onChange={(v) => {
                  setItems((i) => i.map((x, j) => j === idx ? { ...x, rate: Number(v) || 0 } : x));
                }} type="number" min={0} step={0.01} />
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(item.id)} className="mb-1 text-red-600 text-sm">×</button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-sm font-medium text-accent">+ Add line item</button>

        <ToolInput label="Tax Rate (%)" value={taxRate} onChange={(v) => setTaxRate(Number(v) || 0)} type="number" min={0} max={100} step={0.1} />
        <ToolTextarea label="Notes" value={notes} onChange={setNotes} rows={2} />

        <ToolButton onClick={downloadPdf}>Download PDF</ToolButton>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-medium text-gray-500">Invoice Preview</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <div className="text-right text-gray-600">
              <p>#{invoiceNumber}</p>
              <p>{invoiceDate}</p>
              {dueDate && <p>Due: {dueDate}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-bold text-gray-700">From</p>
              <p>{businessName || "—"}</p>
              <p className="whitespace-pre-line text-gray-600">{businessAddress}</p>
              <p className="text-gray-600">{businessEmail}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Bill To</p>
              <p>{clientName || "—"}</p>
              <p className="whitespace-pre-line text-gray-600">{clientAddress}</p>
              <p className="text-gray-600">{clientEmail}</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.filter((i) => i.description).map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                  <td className="py-2 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-1 text-right">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            {taxRate > 0 && <p>Tax ({taxRate}%): {formatCurrency(tax)}</p>}
            <p className="text-lg font-bold">Total: {formatCurrency(total)}</p>
          </div>
          {notes && (
            <div>
              <p className="font-bold text-gray-700">Notes</p>
              <p className="text-gray-600">{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
