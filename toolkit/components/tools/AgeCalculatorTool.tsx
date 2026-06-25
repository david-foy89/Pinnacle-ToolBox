"use client";

import { useMemo, useState } from "react";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
  addYears,
  parseISO,
  isValid,
} from "date-fns";
import { StatCard } from "@/components/tools/ui";

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return isValid(d) ? d : null;
  }
  const d = parseISO(value);
  return isValid(d) ? d : null;
}

export default function AgeCalculatorTool() {
  const [dob, setDob] = useState("1990-06-15");
  const [asOf, setAsOf] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const stats = useMemo(() => {
    const birth = parseDateInput(dob);
    const reference = parseDateInput(asOf);
    if (!birth || !reference) return null;
    if (birth > reference) return { error: "Date of birth must be before the reference date." as const };

    const years = differenceInYears(reference, birth);
    const monthsTotal = differenceInMonths(reference, birth);
    const months = monthsTotal % 12;

    let temp = addYears(birth, years);
    for (let i = 0; i < months; i++) {
      temp = new Date(temp.getFullYear(), temp.getMonth() + 1, temp.getDate());
    }
    const days = differenceInDays(reference, temp);

    const totalDays = differenceInDays(reference, birth);
    const totalWeeks = differenceInWeeks(reference, birth);

    const nextBirthdayYear =
      reference.getMonth() > birth.getMonth() ||
      (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate())
        ? reference.getFullYear() + 1
        : reference.getFullYear();
    const nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
    const daysUntilBirthday = differenceInDays(nextBirthday, reference);
    const turningAge = differenceInYears(nextBirthday, birth);

    return {
      error: null,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths: monthsTotal,
      daysUntilBirthday,
      turningAge,
      nextBirthday: format(nextBirthday, "MMMM d, yyyy"),
    };
  }, [dob, asOf]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dob" className="mb-1 block text-sm font-medium text-gray-700">
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label htmlFor="as-of" className="mb-1 block text-sm font-medium text-gray-700">
            Calculate age as of
          </label>
          <input
            id="as-of"
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {!stats && <p className="text-sm text-gray-500">Enter valid dates to calculate age.</p>}
      {stats && stats.error && (
        <p className="text-sm text-red-600">{stats.error}</p>
      )}
      {stats && !stats.error && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Years" value={stats.years} />
            <StatCard label="Months" value={stats.months} />
            <StatCard label="Days" value={stats.days} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total days lived" value={stats.totalDays.toLocaleString()} />
            <StatCard label="Total weeks" value={stats.totalWeeks.toLocaleString()} />
            <StatCard label="Total months" value={stats.totalMonths.toLocaleString()} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">Next birthday</p>
            <p className="mt-1 text-gray-700">
              {stats.nextBirthday} — turning <strong>{stats.turningAge}</strong> in{" "}
              <strong>{stats.daysUntilBirthday}</strong> day{stats.daysUntilBirthday !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
