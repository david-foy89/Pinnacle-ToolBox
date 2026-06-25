"use client";

import { useMemo, useState } from "react";
import { ToolTextarea, StatCard } from "@/components/tools/ui";
import { cn } from "@/lib/utils";

type DiffLine = {
  type: "same" | "added" | "removed" | "changed";
  left: string;
  right: string;
};

const MAX_DIFF_LINES = 1000;

function computeLineDiff(left: string, right: string): DiffLine[] | { error: string } {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  if (leftLines.length > MAX_DIFF_LINES || rightLines.length > MAX_DIFF_LINES) {
    return { error: `Each side is limited to ${MAX_DIFF_LINES} lines for performance.` };
  }
  const m = leftLines.length;
  const n = rightLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        leftLines[i - 1] === rightLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const raw: { type: "same" | "added" | "removed"; left: string; right: string }[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      raw.unshift({ type: "same", left: leftLines[i - 1], right: rightLines[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      raw.unshift({ type: "added", left: "", right: rightLines[j - 1] });
      j--;
    } else {
      raw.unshift({ type: "removed", left: leftLines[i - 1], right: "" });
      i--;
    }
  }

  const merged: DiffLine[] = [];
  for (let k = 0; k < raw.length; k++) {
    const curr = raw[k];
    const next = raw[k + 1];
    if (curr.type === "removed" && next?.type === "added") {
      merged.push({ type: "changed", left: curr.left, right: next.right });
      k++;
    } else if (curr.type === "same") {
      merged.push({ type: "same", left: curr.left, right: curr.right });
    } else if (curr.type === "added") {
      merged.push({ type: "added", left: "", right: curr.right });
    } else {
      merged.push({ type: "removed", left: curr.left, right: "" });
    }
  }

  return merged;
}

const LINE_STYLES = {
  same: "bg-white",
  added: "bg-green-50",
  removed: "bg-red-50",
  changed: "bg-yellow-50",
};

export default function TextDiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const { diff, diffError, summary } = useMemo(() => {
    const result = computeLineDiff(left, right);
    if ("error" in result) {
      return {
        diff: [] as DiffLine[],
        diffError: result.error,
        summary: { added: 0, removed: 0, changed: 0, same: 0 },
      };
    }

    let added = 0;
    let removed = 0;
    let changed = 0;
    let same = 0;
    for (const line of result) {
      if (line.type === "added") added++;
      else if (line.type === "removed") removed++;
      else if (line.type === "changed") changed++;
      else same++;
    }

    return { diff: result, diffError: null, summary: { added, removed, changed, same } };
  }, [left, right]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ToolTextarea
          label="Original text"
          value={left}
          onChange={setLeft}
          rows={10}
          placeholder="Paste original text…"
        />
        <ToolTextarea
          label="Modified text"
          value={right}
          onChange={setRight}
          rows={10}
          placeholder="Paste modified text…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Unchanged" value={summary.same} />
        <StatCard label="Added" value={summary.added} />
        <StatCard label="Removed" value={summary.removed} />
        <StatCard label="Changed" value={summary.changed} />
      </div>

      {diffError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{diffError}</p>
      )}

      {(left || right) && !diffError && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Side-by-side diff</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/2 border-r border-gray-200 px-3 py-2 text-left font-medium text-gray-600">
                    Original
                  </th>
                  <th className="w-1/2 px-3 py-2 text-left font-medium text-gray-600">
                    Modified
                  </th>
                </tr>
              </thead>
              <tbody>
                {diff.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-4 text-center text-gray-500">
                      No differences
                    </td>
                  </tr>
                ) : (
                  diff.map((line, idx) => (
                    <tr key={idx} className={cn("border-t border-gray-100", LINE_STYLES[line.type])}>
                      <td className="border-r border-gray-200 px-3 py-1 font-mono whitespace-pre-wrap break-words">
                        {line.left || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-3 py-1 font-mono whitespace-pre-wrap break-words">
                        {line.right || <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
