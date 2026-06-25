import { generatePageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = generatePageMetadata(
  "Privacy Policy",
  "Pinnacle Toolbox privacy policy. All tools run client-side in your browser — we do not collect or store your data.",
  "/privacy",
  ["privacy policy", "data privacy", "client-side tools", "no data collection"]
);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="surface-card p-8 prose-page">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-brand-silver-muted">
          Last updated: June 25, 2026
        </p>
        <h2 className="mt-8 text-xl font-semibold">Overview</h2>
        <p>
          Pinnacle Toolbox provides free online tools that run entirely in your web browser. We are
          committed to protecting your privacy.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Data processing</h2>
        <p>
          All tools process data locally in your browser. We do not operate a backend database, and
          we do not store the text, files, or data you enter into our tools. When you upload images or
          files, they are processed on your device using browser APIs such as the Canvas API.
        </p>
        <h2 className="mt-8 text-xl font-semibold">No account required</h2>
        <p>
          You do not need to create an account to use Pinnacle Toolbox. We do not collect personal
          information through tool usage.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Advertising</h2>
        <p>
          In the future, we may display advertisements through third-party providers such as Google
          AdSense. These providers may use cookies and similar technologies to serve ads based on your
          visits to this and other websites. You can opt out of personalized advertising by visiting
          Google&apos;s Ads Settings or the Network Advertising Initiative opt-out page.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Cookies</h2>
        <p>
          We may use essential cookies for site functionality. Third-party advertising partners may
          place cookies on your device when ads are displayed. This policy will be updated as
          advertising is implemented.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p>
          If you have questions about this privacy policy, please visit our{" "}
          <Link href="/contact" className="link-brand hover:underline">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
