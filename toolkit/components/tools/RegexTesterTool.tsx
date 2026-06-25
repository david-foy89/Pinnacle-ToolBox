"use client";

import { useMemo, useState } from "react";
import { ToolInput, ToolTextarea, ToolCheckbox } from "@/components/tools/ui";

interface MatchInfo {
  index: number;
  match: string;
  groups: string[];
}

function buildHighlightedText(text: string, regex: RegExp | null): React.ReactNode[] {
  if (!regex || !text) return [text];

  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  const globalRegex = new RegExp(regex.source, flags);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = globalRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <mark key={key++} className="rounded bg-yellow-200 px-0.5">
        {match[0]}
      </mark>
    );
    lastIndex = globalRegex.lastIndex;
    if (match[0].length === 0) {
      globalRegex.lastIndex++;
    }
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

const MAX_REGEX_INPUT = 50_000;

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const flags = `${flagG ? "g" : ""}${flagI ? "i" : ""}${flagM ? "m" : ""}${flagS ? "s" : ""}`;

  const { regex, matches, parseError } = useMemo(() => {
    if (testString.length > MAX_REGEX_INPUT) {
      return {
        regex: null,
        matches: [] as MatchInfo[],
        parseError: `Test string is limited to ${MAX_REGEX_INPUT.toLocaleString()} characters.`,
      };
    }
    if (!pattern) return { regex: null, matches: [] as MatchInfo[], parseError: null };
    try {
      const re = new RegExp(pattern, flags);
      const found: MatchInfo[] = [];
      if (flagG) {
        let m: RegExpExecArray | null;
        const globalRe = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
        while ((m = globalRe.exec(testString)) !== null) {
          found.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
          if (m[0].length === 0) globalRe.lastIndex++;
        }
      } else {
        const m = re.exec(testString);
        if (m) {
          found.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      }
      return { regex: re, matches: found, parseError: null };
    } catch (e) {
      return {
        regex: null,
        matches: [] as MatchInfo[],
        parseError: e instanceof Error ? e.message : "Invalid regular expression",
      };
    }
  }, [pattern, testString, flags, flagG]);

  const highlighted = useMemo(
    () => buildHighlightedText(testString, regex),
    [testString, regex]
  );

  return (
    <div className="space-y-4">
      <ToolInput
        label="Regular Expression Pattern"
        value={pattern}
        onChange={setPattern}
      />

      <div className="flex flex-wrap gap-4">
        <ToolCheckbox label="Global (g)" checked={flagG} onChange={setFlagG} />
        <ToolCheckbox label="Case insensitive (i)" checked={flagI} onChange={setFlagI} />
        <ToolCheckbox label="Multiline (m)" checked={flagM} onChange={setFlagM} />
        <ToolCheckbox label="Dotall (s)" checked={flagS} onChange={setFlagS} />
      </div>

      {flags && (
        <p className="text-sm text-gray-500">
          Flags: <code className="rounded bg-gray-100 px-1">/{pattern}/{flags}</code>
        </p>
      )}

      <ToolTextarea
        label="Test String"
        value={testString}
        onChange={setTestString}
        rows={6}
        placeholder="Enter text to test against the pattern..."
      />

      {parseError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{parseError}</p>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Highlighted Matches</p>
        <pre className="min-h-[4rem] whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-mono">
          {highlighted}
        </pre>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Matches ({matches.length})
        </p>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500">No matches found</p>
        ) : (
          <ul className="space-y-2">
            {matches.map((m, i) => (
              <li
                key={`${m.index}-${i}`}
                className="rounded-lg border border-gray-200 bg-white p-3 text-sm"
              >
                <span className="font-medium text-gray-900">
                  Match {i + 1}
                </span>
                <span className="ml-2 text-gray-500">@ index {m.index}</span>
                <p className="mt-1 font-mono text-accent">{m.match || "(empty)"}</p>
                {m.groups.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {m.groups.map((g, gi) => (
                      <p key={gi} className="text-gray-600">
                        Group {gi + 1}: <code className="rounded bg-gray-100 px-1">{g}</code>
                      </p>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
