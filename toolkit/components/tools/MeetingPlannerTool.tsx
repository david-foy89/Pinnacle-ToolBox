"use client";

import { useMemo, useState } from "react";
import { ToolInput, ToolSelect } from "@/components/tools/ui";

import { getAllTimeZones } from "@/lib/timezones";

const POPULAR_ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
];

const ALL_ZONES = getAllTimeZones();
const zoneOptions = [
  ...POPULAR_ZONES.map((z) => ({ value: z, label: z.replace(/_/g, " ") })),
  ...ALL_ZONES.filter((z) => !POPULAR_ZONES.includes(z)).map((z) => ({
    value: z,
    label: z.replace(/_/g, " "),
  })),
];

function getHourInZone(date: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  return parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
}

function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:00 ${period}`;
}

interface OverlapSlot {
  utcHour: number;
  zones: { tz: string; localHour: number; inBusiness: boolean }[];
  allInBusiness: boolean;
}

export default function MeetingPlannerTool() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [zones, setZones] = useState<string[]>([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
  ]);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);

  const overlaps = useMemo(() => {
    const base = new Date(`${date}T12:00:00Z`);
    const slots: OverlapSlot[] = [];

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      const slotDate = new Date(base);
      slotDate.setUTCHours(utcHour, 0, 0, 0);

      const zoneData = zones.map((tz) => {
        const localHour = getHourInZone(slotDate, tz);
        const inBusiness = localHour >= startHour && localHour < endHour;
        return { tz, localHour, inBusiness };
      });

      slots.push({
        utcHour,
        zones: zoneData,
        allInBusiness: zoneData.every((z) => z.inBusiness),
      });
    }

    return slots;
  }, [date, zones, startHour, endHour]);

  const bestSlots = overlaps.filter((s) => s.allInBusiness);

  const addZone = () => {
    const next = ALL_ZONES.find((z) => !zones.includes(z)) ?? "UTC";
    setZones((z) => [...z, next]);
  };

  const removeZone = (idx: number) => {
    setZones((z) => z.filter((_, i) => i !== idx));
  };

  const updateZone = (idx: number, tz: string) => {
    setZones((z) => z.map((v, i) => (i === idx ? tz : v)));
  };

  return (
    <div className="space-y-6">
      <ToolInput label="Date" value={date} onChange={setDate} type="date" />

      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput label="Business start hour (local)" value={startHour} onChange={(v) => setStartHour(Number(v))} type="number" min={0} max={23} />
        <ToolInput label="Business end hour (local)" value={endHour} onChange={(v) => setEndHour(Number(v))} type="number" min={1} max={24} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Participant Timezones</h3>
        {zones.map((tz, idx) => (
          <div key={`${tz}-${idx}`} className="flex items-end gap-2">
            <div className="flex-1">
              <ToolSelect
                label={`Timezone ${idx + 1}`}
                value={tz}
                onChange={(v) => updateZone(idx, v)}
                options={zoneOptions}
              />
            </div>
            {zones.length > 1 && (
              <button type="button" onClick={() => removeZone(idx)} className="mb-1 text-sm text-red-600 hover:text-red-700">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addZone} className="text-sm font-medium text-accent hover:text-accent/80">
          + Add timezone
        </button>
      </div>

      {bestSlots.length > 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-medium text-green-800">
            {bestSlots.length} hour{bestSlots.length !== 1 ? "s" : ""} of overlap ({startHour}:00–{endHour}:00 local in all zones)
          </h3>
          <div className="flex flex-wrap gap-2">
            {bestSlots.map((slot) => (
              <span key={slot.utcHour} className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                UTC {String(slot.utcHour).padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          No overlapping business hours found for all selected timezones on this date.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[600px] text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-700">UTC</th>
              {zones.map((tz) => (
                <th key={tz} className="px-2 py-2 text-left font-medium text-gray-700">
                  {tz.split("/").pop()?.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {overlaps.map((slot) => (
              <tr
                key={slot.utcHour}
                className={slot.allInBusiness ? "bg-green-50" : "border-t border-gray-100"}
              >
                <td className="px-2 py-1 font-mono text-gray-600">
                  {String(slot.utcHour).padStart(2, "0")}:00
                </td>
                {slot.zones.map((z) => (
                  <td
                    key={z.tz}
                    className={`px-2 py-1 ${z.inBusiness ? "font-medium text-green-700" : "text-gray-400"}`}
                  >
                    {formatHour(z.localHour)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Green rows indicate hours where all participants are within {startHour}:00–{endHour}:00 local business hours.
      </p>
    </div>
  );
}
