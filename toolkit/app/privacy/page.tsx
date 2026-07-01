import { generatePageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "Privacy Policy",
  "Pinnacle Toolbox privacy policy. Client-side tools, Google AdSense advertising disclosure, and cookie information.",
  "/privacy",
  ["privacy policy", "cookies", "google adsense", "advertising"]
);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="surface-card p-8 prose-page">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-brand-silver-muted">Last updated: June 25, 2026</p>

        <h2 className="mt-8 text-xl font-semibold">Overview</h2>
        <p>
          Pinnacle Toolbox (&quot;we&quot;, &quot;us&quot;) provides free online tools at{" "}
          <Link href="https://pinnacletoolbox.com" className="link-brand hover:underline">
            pinnacletoolbox.com
          </Link>
          . This policy explains how we handle information when you use our site.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Tool data stays on your device</h2>
        <p>
          Our tools run entirely in your web browser. We do not operate a backend database for tool
          input, and we do not store the text, files, or data you enter. When you upload images or
          files, they are processed on your device using browser APIs such as the Canvas API.
        </p>

        <h2 className="mt-8 text-xl font-semibold">No account required</h2>
        <p>
          You do not need to create an account to use Pinnacle Toolbox. We do not collect personal
          information through normal tool usage.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Advertising (Google AdSense)</h2>
        <p>
          We use <strong>Google AdSense</strong> to display advertisements. Google and its partners
          may use cookies and similar technologies to serve ads based on your prior visits to this
          site or other websites.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based
            on your visit to our site and/or other sites on the Internet.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="link-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            See how Google uses data from sites that use its services:{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="link-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Partner Sites Policy
            </a>
            .
          </li>
          <li>
            Learn about advertising technologies:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="link-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses cookies in advertising
            </a>
            .
          </li>
        </ul>
        <p className="mt-3">
          Our authorized digital seller file is published at{" "}
          <Link href="/ads.txt" className="link-brand hover:underline">
            /ads.txt
          </Link>
          .
        </p>

        <h2 className="mt-8 text-xl font-semibold">Cookies</h2>
        <p>
          We may use essential cookies for site functionality. When you accept cookies in our banner,
          third-party advertising partners (including Google) may place cookies on your device to
          measure ad performance and show relevant ads. You can decline non-essential cookies using
          the banner on your first visit.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Contact form</h2>
        <p>
          If you submit our contact form, your name, email, and message are sent to us through our
          form provider (Formspree) so we can respond. We use that information only to reply to your
          inquiry.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p>
          Questions about this policy? Visit our{" "}
          <Link href="/contact" className="link-brand hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
