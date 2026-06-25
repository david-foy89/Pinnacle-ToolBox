"use client";

import { useMemo, useState } from "react";
import { CronExpressionParser } from "cron-parser";
import { normalizeCronExpression } from "@/lib/cron";
import { ToolInput, StatCard } from "@/components/tools/ui";
const FIELD_LABELS = ["second", "minute", "hour", "day of month", "month", "day of week"] as const;

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function describeField(value: string, label: string): string {
  if (value === "*" || value === "?") return `every ${label}`;
  if (value.startsWith("*/")) return `every ${value.slice(2)} ${label}s`;
  if (value.includes("-")) {
    const [a, b] = value.split("-");
    return `${label} from ${a} to ${b}`;
  }
  if (value.includes(",")) return `${label} at ${value.replace(/,/g, ", ")}`;
  return `${label} at ${value}`;
}

function describeCron(expression: string): string {
  const trimmed = expression.trim();

  if (trimmed.startsWith("@")) {
    const aliases: Record<string, string> = {
      "@yearly": "Once a year at midnight on January 1st",
      "@annually": "Once a year at midnight on January 1st",
      "@monthly": "Once a month at midnight on the 1st",
      "@weekly": "Once a week at midnight on Sunday",
      "@daily": "Once a day at midnight",
      "@hourly": "Once an hour at the start of the hour",
      "@minutely": "Once a minute",
      "@secondly": "Every second",
      "@weekdays": "At midnight Monday through Friday",
      "@weekends": "At midnight on Saturday and Sunday",
    };
    return aliases[trimmed] ?? `Cron alias: ${trimmed}`;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length < 5) return "Invalid cron expression";

  const fields = parts.length === 5
    ? ["0", ...parts]
    : parts.slice(0, 6);

  const descriptions = fields.map((f, i) => describeField(f, FIELD_LABELS[i]));

  let extra = "";
  if (fields[3] !== "*" && fields[3] !== "?" && fields[5] !== "*" && fields[5] !== "?") {
    extra = " (both day-of-month and day-of-week are specified)";
  }

  const monthField = fields[4];
  if (/^\d+$/.test(monthField)) {
    const idx = parseInt(monthField, 10);
    if (idx >= 1 && idx <= 12) {
      descriptions[4] = `in ${MONTH_NAMES[idx]}`;
    }
  }

  const dowField = fields[5];
  if (/^\d$/.test(dowField)) {
    const idx = parseInt(dowField, 10);
    if (idx >= 0 && idx <= 6) {
      descriptions[5] = `on ${DOW_NAMES[idx]}`;
    }
  }

  return `Runs ${descriptions.join(", ")}${extra}.`;
}

export default function CronExplainerTool() {
  const [expression, setExpression] = useState("0 9 * * 1-5");

  const result = useMemo(() => {
    const trimmed = expression.trim();
    if (!trimmed) return null;

    try {
      const normalized = normalizeCronExpression(trimmed);
      const interval = CronExpressionParser.parse(normalized);
      const nextRuns: string[] = [];
      for (let i = 0; i < 5; i++) {
        nextRuns.push(interval.next().toDate().toLocaleString());
      }
      return {
        description: describeCron(trimmed),
        nextRuns,
        error: null,
      };
    } catch (e) {
      return {
        description: "",
        nextRuns: [] as string[],
        error: e instanceof Error ? e.message : "Invalid cron expression",
      };
    }
  }, [expression]);

  return (
    <div className="space-y-4">
      <ToolInput
        label="Cron Expression"
        value={expression}
        onChange={setExpression}
      />

      <p className="text-sm text-gray-500">
        Standard 5-field (minute hour day month weekday) or 6-field (with seconds) cron syntax.
        Supports aliases like @daily, @hourly.
      </p>

      {result?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>
      )}

      {result && !result.error && (
        <>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">Plain English</p>
            <p className="mt-1 text-blue-800">{result.description}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Next 5 Scheduled Runs</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.nextRuns.map((run, i) => (
                <StatCard key={i} label={`Run ${i + 1}`} value={run} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
