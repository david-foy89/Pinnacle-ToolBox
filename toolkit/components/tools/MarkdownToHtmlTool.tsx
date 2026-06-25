"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import { sanitizeHtml } from "@/lib/sanitize";
import { ToolTextarea } from "@/components/tools/ui";
import CopyButton from "@/components/CopyButton";

export default function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState(`# Hello World

Write **markdown** here and see the preview update in real time.

- Item one
- Item two

\`\`\`js
console.log("code block");
\`\`\`
`);

  const html = useMemo(() => {
    try {
      const raw = marked.parse(markdown, { async: false }) as string;
      return sanitizeHtml(raw);
    } catch {
      return "<p>Unable to parse markdown</p>";
    }
  }, [markdown]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={html} label="Copy HTML" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea
          label="Markdown"
          value={markdown}
          onChange={setMarkdown}
          rows={18}
          placeholder="# Heading\n\nYour markdown here..."
        />

        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">HTML Preview</p>
          <div
            className="prose prose-sm max-h-[28rem] min-h-[12rem] max-w-none overflow-auto rounded-lg border border-gray-200 bg-white p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Raw HTML Output</p>
        <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs whitespace-pre-wrap break-words">
          {html}
        </pre>
      </div>
    </div>
  );
}
