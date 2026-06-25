"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ToolInput, ToolButton, ToolSelect } from "@/components/tools/ui";
import { cn, downloadBlob } from "@/lib/utils";

type QrTab = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard";

const TABS: { id: QrTab; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "sms", label: "SMS" },
  { id: "wifi", label: "WiFi" },
  { id: "vcard", label: "vCard" },
];

function escapeWifiField(value: string): string {
  return value.replace(/([\\;,"])/g, "\\$1");
}

function escapeVCardField(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function buildQrContent(tab: QrTab, fields: Record<string, string>): string {
  switch (tab) {
    case "url":
      return fields.url || "";
    case "text":
      return fields.text || "";
    case "email":
      return `mailto:${fields.email}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`;
    case "phone":
      return `tel:${fields.phone}`;
    case "sms":
      return `sms:${fields.smsPhone}?body=${encodeURIComponent(fields.smsBody || "")}`;
    case "wifi":
      return `WIFI:T:${escapeWifiField(fields.wifiSecurity || "WPA")};S:${escapeWifiField(fields.wifiSsid)};P:${escapeWifiField(fields.wifiPassword)};;`;
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escapeVCardField(fields.vcardName)}`,
        fields.vcardOrg ? `ORG:${escapeVCardField(fields.vcardOrg)}` : "",
        fields.vcardPhone ? `TEL:${escapeVCardField(fields.vcardPhone)}` : "",
        fields.vcardEmail ? `EMAIL:${escapeVCardField(fields.vcardEmail)}` : "",
        fields.vcardUrl ? `URL:${escapeVCardField(fields.vcardUrl)}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    default:
      return "";
  }
}

export default function QrGeneratorTool() {
  const [tab, setTab] = useState<QrTab>("url");
  const [fields, setFields] = useState<Record<string, string>>({
    url: "https://example.com",
    text: "Hello, World!",
    email: "",
    subject: "",
    body: "",
    phone: "",
    smsPhone: "",
    smsBody: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiSecurity: "WPA",
    vcardName: "",
    vcardOrg: "",
    vcardPhone: "",
    vcardEmail: "",
    vcardUrl: "",
  });
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const content = buildQrContent(tab, fields);

  const generate = useCallback(async () => {
    if (!content.trim()) {
      setError("Enter content to generate a QR code.");
      setDataUrl(null);
      setSvgString(null);
      return;
    }
    setError(null);
    try {
      const opts = { color: { dark: fgColor, light: bgColor }, margin: 2, width: 280 };
      const url = await QRCode.toDataURL(content, opts);
      const svg = await QRCode.toString(content, { ...opts, type: "svg" });
      setDataUrl(url);
      setSvgString(svg);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, content, opts);
      }
    } catch {
      setError("Failed to generate QR code. Check your input.");
      setDataUrl(null);
      setSvgString(null);
    }
  }, [content, fgColor, bgColor]);

  useEffect(() => {
    const timer = setTimeout(() => { void generate(); }, 300);
    return () => clearTimeout(timer);
  }, [generate]);

  const downloadPng = () => {
    if (!dataUrl) return;
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => downloadBlob(blob, "qrcode.png"));
  };

  const downloadSvg = () => {
    if (!svgString) return;
    downloadBlob(new Blob([svgString], { type: "image/svg+xml" }), "qrcode.svg");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition",
              tab === t.id ? "border-b-2 border-accent text-accent" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "url" && <ToolInput label="URL" value={fields.url} onChange={(v) => setField("url", v)} />}
      {tab === "text" && <ToolInput label="Text" value={fields.text} onChange={(v) => setField("text", v)} />}
      {tab === "email" && (
        <div className="space-y-3">
          <ToolInput label="Email" value={fields.email} onChange={(v) => setField("email", v)} />
          <ToolInput label="Subject" value={fields.subject} onChange={(v) => setField("subject", v)} />
          <ToolInput label="Body" value={fields.body} onChange={(v) => setField("body", v)} />
        </div>
      )}
      {tab === "phone" && <ToolInput label="Phone Number" value={fields.phone} onChange={(v) => setField("phone", v)} />}
      {tab === "sms" && (
        <div className="space-y-3">
          <ToolInput label="Phone Number" value={fields.smsPhone} onChange={(v) => setField("smsPhone", v)} />
          <ToolInput label="Message" value={fields.smsBody} onChange={(v) => setField("smsBody", v)} />
        </div>
      )}
      {tab === "wifi" && (
        <div className="space-y-3">
          <ToolInput label="Network Name (SSID)" value={fields.wifiSsid} onChange={(v) => setField("wifiSsid", v)} />
          <ToolInput label="Password" value={fields.wifiPassword} onChange={(v) => setField("wifiPassword", v)} />
          <ToolSelect
            label="Security"
            value={fields.wifiSecurity}
            onChange={(v) => setField("wifiSecurity", v)}
            options={[
              { value: "WPA", label: "WPA/WPA2" },
              { value: "WEP", label: "WEP" },
              { value: "nopass", label: "None" },
            ]}
          />
        </div>
      )}
      {tab === "vcard" && (
        <div className="space-y-3">
          <ToolInput label="Full Name" value={fields.vcardName} onChange={(v) => setField("vcardName", v)} />
          <ToolInput label="Organization" value={fields.vcardOrg} onChange={(v) => setField("vcardOrg", v)} />
          <ToolInput label="Phone" value={fields.vcardPhone} onChange={(v) => setField("vcardPhone", v)} />
          <ToolInput label="Email" value={fields.vcardEmail} onChange={(v) => setField("vcardEmail", v)} />
          <ToolInput label="Website" value={fields.vcardUrl} onChange={(v) => setField("vcardUrl", v)} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fg-color" className="mb-1 block text-sm font-medium text-gray-700">Foreground</label>
          <input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-gray-300" />
        </div>
        <div>
          <label htmlFor="bg-color" className="mb-1 block text-sm font-medium text-gray-700">Background</label>
          <input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-gray-300" />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <canvas ref={canvasRef} className="hidden" />
        {dataUrl && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="Generated QR code" width={280} height={280} />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => void generate()}>Regenerate</ToolButton>
          <ToolButton onClick={downloadPng} variant="secondary" disabled={!dataUrl}>Download PNG</ToolButton>
          <ToolButton onClick={downloadSvg} variant="secondary" disabled={!svgString}>Download SVG</ToolButton>
        </div>
      </div>
    </div>
  );
}
