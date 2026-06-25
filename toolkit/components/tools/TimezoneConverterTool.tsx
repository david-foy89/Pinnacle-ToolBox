"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolInput, ToolSelect } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";

import { getAllTimeZones, POPULAR_TIMEZONES as POPULAR } from "@/lib/timezones";

const TIMEZONES = getAllTimeZones();

function formatInZone(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
}

function getOffset(date: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  }).formatToParts(date);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

export default function TimezoneConverterTool() {
  const [sourceDate, setSourceDate] = useState("");
  const [sourceTime, setSourceTime] = useState("");
  const [zones, setZones] = useState<string[]>([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
  ]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sourceDate) {
      const d = new Date();
      setSourceDate(d.toISOString().slice(0, 10));
      setSourceTime(d.toTimeString().slice(0, 5));
    }
  }, [sourceDate]);

  const baseDate = useMemo(() => {
    if (!sourceDate || !sourceTime) return now;
    const local = new Date(`${sourceDate}T${sourceTime}:00`);
    return isNaN(local.getTime()) ? now : local;
  }, [sourceDate, sourceTime, now]);

  const addZone = () => {
    const next = TIMEZONES.find((tz) => !zones.includes(tz)) ?? "UTC";
    setZones((z) => [...z, next]);
  };

  const removeZone = (idx: number) => {
    setZones((z) => z.filter((_, i) => i !== idx));
  };

  const updateZone = (idx: number, tz: string) => {
    setZones((z) => z.map((v, i) => (i === idx ? tz : v)));
  };

  const zoneOptions = [
    ...POPULAR.map((tz) => ({ value: tz, label: tz.replace(/_/g, " ") })),
    ...TIMEZONES.filter((tz) => !POPULAR.includes(tz)).map((tz) => ({
      value: tz,
      label: tz.replace(/_/g, " "),
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput label="Date" value={sourceDate} onChange={setSourceDate} type="date" />
        <ToolInput label="Time (your local)" value={sourceTime} onChange={setSourceTime} type="time" />
      </div>

      <p className="text-sm text-gray-500">
        Local time: {formatInZone(now, Intl.DateTimeFormat().resolvedOptions().timeZone)}
      </p>

      <div className="space-y-3">
        {zones.map((tz, idx) => {
          const formatted = formatInZone(baseDate, tz);
          return (
            <div key={`${tz}-${idx}`} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="min-w-[200px] flex-1">
                  <ToolSelect
                    label={`Timezone ${idx + 1}`}
                    value={tz}
                    onChange={(v) => updateZone(idx, v)}
                    options={zoneOptions}
                  />
                </div>
                {zones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeZone(idx)}
                    className="mt-5 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatted}</p>
              <p className="text-sm text-gray-500">{getOffset(baseDate, tz)}</p>
              <CopyButton text={formatted} label="Copy" className="mt-2" />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addZone}
        className="text-sm font-medium text-accent hover:text-accent/80"
      >
        + Add timezone
      </button>
    </div>
  );
}
