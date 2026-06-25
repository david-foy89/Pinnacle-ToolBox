import {
  ArrowLeftRight, BarChart3, Binary, BookOpen, Braces, Cake, CalendarRange, CaseSensitive, CircleStop, Clock, Clock3, Code, Code2, Crop, Divide, Eraser, Eye, FileCode, FileSpreadsheet, FileText, FileType, FileUser, Fingerprint, GitCompare, Globe, Globe2, Hash, Hourglass, Image, Key, KeyRound, Languages, Layers, Link, Link2, ListMinus, Lock, Maximize2, Minimize2, Paintbrush, Palette, Percent, Pipette, QrCode, Receipt, RefreshCw, Ruler, ScanBarcode, Search, Sheet, ShieldOff, Shrink, Sparkles, Superscript, SwatchBook, Table, Timer, Type, Users,
} from "lucide-react";
import type { Tool, ToolCategory } from "./types";
import { SITE_NAME } from "./utils";

function makeMetaDesc(description: string, name: string, category: string): string {
  const base = `Free ${name.toLowerCase()} online — ${description} Private, instant, no sign-up. ${category} tool that runs in your browser.`;
  return base.length <= 160 ? base : base.slice(0, 157) + "...";
}

function makeFaqs(name: string) {
  return [
    { question: `Is the ${name} free to use?`, answer: `Yes, ${name} is completely free with no login required. All processing happens in your browser.` },
    { question: `Does ${name} store my data?`, answer: "No. Pinnacle Toolbox runs entirely client-side. Your data never leaves your device unless you choose to download or copy it." },
    { question: `Can I use ${name} on mobile?`, answer: "Yes. All tools are mobile-responsive and work in modern mobile browsers." },
    { question: "Do I need to create an account?", answer: "No account is needed. Just open the tool and start using it immediately." },
    { question: "Is my data secure?", answer: "Your data is processed locally in your browser. We do not send your input to any server." },
  ];
}

function makeHowTo(name: string): string[] {
  return [
    `Open the ${name} tool on Pinnacle Toolbox.`,
    "Enter or upload your input in the tool interface.",
    "Adjust any available options to customize the output.",
    "Review the results displayed instantly on screen.",
    "Copy or download the output as needed.",
  ];
}

function mk(slug: string, name: string, category: ToolCategory, description: string, icon: Tool["icon"], relatedTools: string[]): Tool {
  return {
    slug,
    name,
    category,
    description,
    icon,
    relatedTools,
    metaTitle: `Free ${name} Online — No Login | ${SITE_NAME}`,
    metaDescription: makeMetaDesc(description, name, category),
    faqs: makeFaqs(name),
    howToUse: makeHowTo(name),
  };
}

export const tools: Tool[] = [
  mk("word-counter", "Word Counter", "Text Tools", "Count words, characters, sentences, and reading time instantly.", Type, ["case-converter", "readability-checker", "word-frequency", "whitespace-remover"]),
  mk("case-converter", "Case Converter", "Text Tools", "Convert text between uppercase, lowercase, title case, and more.", CaseSensitive, ["word-counter", "text-to-slug", "reverse-text", "whitespace-remover"]),
  mk("duplicate-line-remover", "Duplicate Line Remover", "Text Tools", "Remove duplicate lines from text while preserving order.", ListMinus, ["whitespace-remover", "word-counter", "text-diff-checker", "case-converter"]),
  mk("text-to-slug", "Text to Slug", "Text Tools", "Convert any text into a clean, URL-safe slug.", Link, ["case-converter", "url-encoder", "word-counter", "whitespace-remover"]),
  mk("lorem-ipsum-generator", "Lorem Ipsum Generator", "Text Tools", "Generate placeholder Lorem Ipsum text for designs and mockups.", FileText, ["word-counter", "case-converter", "text-to-slug", "readability-checker"]),
  mk("text-diff-checker", "Text Diff Checker", "Text Tools", "Compare two texts side by side and highlight differences.", GitCompare, ["duplicate-line-remover", "word-counter", "whitespace-remover", "word-frequency"]),
  mk("word-frequency", "Word Frequency", "Text Tools", "Analyze word frequency with counts and percentages.", BarChart3, ["word-counter", "readability-checker", "text-diff-checker", "case-converter"]),
  mk("reverse-text", "Reverse Text", "Text Tools", "Reverse strings, words, or character order in your text.", ArrowLeftRight, ["case-converter", "word-counter", "whitespace-remover", "text-to-slug"]),
  mk("whitespace-remover", "Whitespace Remover", "Text Tools", "Clean up extra spaces, blank lines, and trim text.", Eraser, ["duplicate-line-remover", "word-counter", "case-converter", "text-to-slug"]),
  mk("readability-checker", "Readability Checker", "Text Tools", "Check Flesch reading ease, grade level, and reading time.", BookOpen, ["word-counter", "word-frequency", "lorem-ipsum-generator", "case-converter"]),
  mk("unit-converter", "Unit Converter", "Math & Conversion", "Convert length, weight, temperature, speed, and more.", Ruler, ["percentage-calculator", "scientific-notation-converter", "fraction-to-decimal", "tip-calculator"]),
  mk("percentage-calculator", "Percentage Calculator", "Math & Conversion", "Calculate percentages, ratios, and percentage change.", Percent, ["tip-calculator", "unit-converter", "fraction-to-decimal", "scientific-notation-converter"]),
  mk("fraction-to-decimal", "Fraction to Decimal", "Math & Conversion", "Convert fractions to decimals and decimals to fractions.", Divide, ["percentage-calculator", "roman-numeral-converter", "binary-hex-converter", "number-to-words"]),
  mk("roman-numeral-converter", "Roman Numeral Converter", "Math & Conversion", "Convert between integers and Roman numerals (1–3999).", Hash, ["number-to-words", "fraction-to-decimal", "binary-hex-converter", "scientific-notation-converter"]),
  mk("number-to-words", "Number to Words", "Math & Conversion", "Convert numbers to English words in US or UK style.", Languages, ["roman-numeral-converter", "fraction-to-decimal", "binary-hex-converter", "scientific-notation-converter"]),
  mk("binary-hex-converter", "Binary Hex Converter", "Math & Conversion", "Convert between binary, decimal, hexadecimal, and octal.", Binary, ["roman-numeral-converter", "scientific-notation-converter", "hash-generator", "base64-encoder"]),
  mk("age-calculator", "Age Calculator", "Math & Conversion", "Calculate exact age in years, months, days, and more.", Cake, ["date-difference-calculator", "unix-timestamp-converter", "timezone-converter", "countdown-timer"]),
  mk("date-difference-calculator", "Date Difference Calculator", "Math & Conversion", "Find the difference between two dates in days, weeks, and months.", CalendarRange, ["age-calculator", "unix-timestamp-converter", "timezone-converter", "meeting-planner"]),
  mk("tip-calculator", "Tip Calculator", "Math & Conversion", "Calculate tips and split bills among multiple people.", Receipt, ["percentage-calculator", "unit-converter", "invoice-generator", "fraction-to-decimal"]),
  mk("scientific-notation-converter", "Scientific Notation Converter", "Math & Conversion", "Convert between standard and scientific notation.", Superscript, ["binary-hex-converter", "unit-converter", "percentage-calculator", "fraction-to-decimal"]),
  mk("hex-to-rgb", "HEX to RGB", "Design & Color", "Convert colors between HEX, RGB, HSL, and HSV formats.", Palette, ["color-picker", "contrast-checker", "tint-shade-generator", "gradient-generator"]),
  mk("color-picker", "Color Picker", "Design & Color", "Pick colors and get HEX, RGB, and HSL values instantly.", Pipette, ["hex-to-rgb", "color-palette-generator", "gradient-generator", "contrast-checker"]),
  mk("color-palette-generator", "Color Palette Generator", "Design & Color", "Generate complementary, analogous, and triadic color palettes.", SwatchBook, ["color-picker", "gradient-generator", "tint-shade-generator", "hex-to-rgb"]),
  mk("gradient-generator", "Gradient Generator", "Design & Color", "Create CSS linear gradients with live preview.", Paintbrush, ["color-picker", "color-palette-generator", "hex-to-rgb", "tint-shade-generator"]),
  mk("contrast-checker", "Contrast Checker", "Design & Color", "Check WCAG color contrast ratios for accessibility.", Eye, ["hex-to-rgb", "color-picker", "tint-shade-generator", "gradient-generator"]),
  mk("tint-shade-generator", "Tint Shade Generator", "Design & Color", "Generate tints and shades from any base color.", Layers, ["hex-to-rgb", "color-palette-generator", "contrast-checker", "color-picker"]),
  mk("image-color-extractor", "Image Color Extractor", "Design & Color", "Extract dominant colors from any uploaded image.", Image, ["color-picker", "hex-to-rgb", "color-palette-generator", "favicon-generator"]),
  mk("image-resizer", "Image Resizer", "Image Tools", "Resize images to custom dimensions in your browser.", Maximize2, ["image-compressor", "image-cropper", "image-converter", "image-to-base64"]),
  mk("image-compressor", "Image Compressor", "Image Tools", "Compress images with adjustable quality settings.", Shrink, ["image-resizer", "image-converter", "exif-remover", "image-to-base64"]),
  mk("image-to-base64", "Image to Base64", "Image Tools", "Convert images to Base64 strings and data URLs.", Code, ["base64-encoder", "image-converter", "image-compressor", "favicon-generator"]),
  mk("image-converter", "Image Converter", "Image Tools", "Convert images between PNG, JPG, and WEBP formats.", RefreshCw, ["image-resizer", "image-compressor", "image-cropper", "exif-remover"]),
  mk("image-cropper", "Image Cropper", "Image Tools", "Crop images with precise x, y, width, and height controls.", Crop, ["image-resizer", "image-converter", "favicon-generator", "image-compressor"]),
  mk("exif-remover", "EXIF Remover", "Image Tools", "Strip EXIF metadata from images for privacy.", ShieldOff, ["image-compressor", "image-converter", "image-resizer", "image-to-base64"]),
  mk("favicon-generator", "Favicon Generator", "Image Tools", "Generate favicon sizes and download as a ZIP file.", Sparkles, ["image-resizer", "image-cropper", "image-color-extractor", "image-converter"]),
  mk("json-formatter", "JSON Formatter", "Developer Tools", "Format, minify, and validate JSON data.", Braces, ["csv-to-json", "json-to-csv", "base64-encoder", "jwt-decoder"]),
  mk("base64-encoder", "Base64 Encoder", "Developer Tools", "Encode and decode text and files to Base64.", Lock, ["url-encoder", "hash-generator", "image-to-base64", "json-formatter"]),
  mk("url-encoder", "URL Encoder", "Developer Tools", "Encode and decode URLs and URI components.", Globe, ["html-entity-encoder", "base64-encoder", "url-analyzer", "text-to-slug"]),
  mk("html-entity-encoder", "HTML Entity Encoder", "Developer Tools", "Encode and decode HTML entities safely.", Code2, ["url-encoder", "markdown-to-html", "html-minifier", "base64-encoder"]),
  mk("regex-tester", "Regex Tester", "Developer Tools", "Test regular expressions with live match highlighting.", Search, ["json-formatter", "url-encoder", "jwt-decoder", "hash-generator"]),
  mk("jwt-decoder", "JWT Decoder", "Developer Tools", "Decode JWT tokens and inspect header and payload.", Key, ["base64-encoder", "hash-generator", "json-formatter", "uuid-generator"]),
  mk("uuid-generator", "UUID Generator", "Developer Tools", "Generate UUID v4 identifiers in bulk.", Fingerprint, ["password-generator", "hash-generator", "jwt-decoder", "json-formatter"]),
  mk("password-generator", "Password Generator", "Developer Tools", "Generate secure random passwords with custom options.", KeyRound, ["uuid-generator", "hash-generator", "base64-encoder", "jwt-decoder"]),
  mk("hash-generator", "Hash Generator", "Developer Tools", "Generate SHA-1, SHA-256, SHA-384, SHA-512, and MD5 hashes.", Hash, ["password-generator", "base64-encoder", "jwt-decoder", "uuid-generator"]),
  mk("cron-explainer", "Cron Explainer", "Developer Tools", "Explain cron expressions and show next run times.", Clock, ["unix-timestamp-converter", "timezone-converter", "json-formatter", "regex-tester"]),
  mk("css-minifier", "CSS Minifier", "Developer Tools", "Minify CSS to reduce file size.", Minimize2, ["html-minifier", "json-formatter", "markdown-to-html", "regex-tester"]),
  mk("html-minifier", "HTML Minifier", "Developer Tools", "Minify HTML by removing whitespace and comments.", FileCode, ["css-minifier", "markdown-to-html", "html-entity-encoder", "json-formatter"]),
  mk("markdown-to-html", "Markdown to HTML", "Developer Tools", "Convert Markdown to HTML with live preview.", FileType, ["html-minifier", "html-entity-encoder", "json-formatter", "css-minifier"]),
  mk("qr-generator", "QR Generator", "QR & Code", "Create QR codes for URLs, WiFi, vCards, and more.", QrCode, ["barcode-generator", "url-analyzer", "url-encoder", "favicon-generator"]),
  mk("barcode-generator", "Barcode Generator", "QR & Code", "Generate CODE128, EAN-13, and UPC-A barcodes.", ScanBarcode, ["qr-generator", "url-analyzer", "uuid-generator", "hash-generator"]),
  mk("url-analyzer", "URL Analyzer", "QR & Code", "Analyze URL structure and check for suspicious patterns.", Link2, ["url-encoder", "qr-generator", "jwt-decoder", "regex-tester"]),
  mk("pomodoro-timer", "Pomodoro Timer", "Time & Productivity", "Focus timer with work sessions and breaks.", Timer, ["stopwatch", "countdown-timer", "meeting-planner", "timezone-converter"]),
  mk("stopwatch", "Stopwatch", "Time & Productivity", "Simple stopwatch with lap and split times.", CircleStop, ["pomodoro-timer", "countdown-timer", "unix-timestamp-converter", "timezone-converter"]),
  mk("countdown-timer", "Countdown Timer", "Time & Productivity", "Set a countdown timer with hours, minutes, and seconds.", Hourglass, ["pomodoro-timer", "stopwatch", "age-calculator", "meeting-planner"]),
  mk("timezone-converter", "Timezone Converter", "Time & Productivity", "Convert times across multiple timezones.", Globe2, ["unix-timestamp-converter", "meeting-planner", "date-difference-calculator", "cron-explainer"]),
  mk("unix-timestamp-converter", "Unix Timestamp Converter", "Time & Productivity", "Convert Unix timestamps to dates and vice versa.", Clock3, ["timezone-converter", "date-difference-calculator", "cron-explainer", "age-calculator"]),
  mk("meeting-planner", "Meeting Planner", "Time & Productivity", "Find overlapping business hours across timezones.", Users, ["timezone-converter", "pomodoro-timer", "date-difference-calculator", "countdown-timer"]),
  mk("resume-builder", "Resume Builder", "Document Tools", "Build a professional resume and download as PDF.", FileUser, ["invoice-generator", "markdown-to-html", "lorem-ipsum-generator", "word-counter"]),
  mk("invoice-generator", "Invoice Generator", "Document Tools", "Create invoices with line items and download as PDF.", FileSpreadsheet, ["resume-builder", "tip-calculator", "csv-to-json", "percentage-calculator"]),
  mk("csv-to-json", "CSV to JSON", "Document Tools", "Convert CSV data to formatted JSON.", Table, ["json-to-csv", "json-formatter", "invoice-generator", "markdown-to-html"]),
  mk("json-to-csv", "JSON to CSV", "Document Tools", "Convert JSON arrays to CSV format.", Sheet, ["csv-to-json", "json-formatter", "invoice-generator", "resume-builder"]),
];

export function getToolBySlug(slug: string): Tool | undefined { return tools.find((t) => t.slug === slug); }
export function getToolsByCategory(category: ToolCategory): Tool[] { return tools.filter((t) => t.category === category); }
export function getAllCategories(): ToolCategory[] { return Array.from(new Set(tools.map((t) => t.category))); }
export function getToolCount(): number { return tools.length; }
export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.slug.includes(q));
}
