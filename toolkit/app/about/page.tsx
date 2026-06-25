import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "About",
  "Learn about Pinnacle Toolbox — 60+ free browser-based online tools for text, images, code, and productivity. No login, no data collection.",
  "/about",
  ["about pinnacle toolbox", "free online tools", "browser-based utilities", "privacy-first tools"]
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="surface-card p-8">
        <h1 className="text-3xl font-bold text-brand-white">About Pinnacle Toolbox</h1>
        <p className="mt-4 text-brand-silver">
          Pinnacle Toolbox is a collection of free, browser-based online tools designed for speed,
          simplicity, and privacy. Whether you need to format JSON, resize an image, convert units,
          or generate a QR code, our tools work instantly in your browser.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-brand-white">No login required</h2>
        <p className="mt-2 text-brand-silver">
          Every tool on Pinnacle Toolbox is free to use with no account creation, no subscriptions,
          and no hidden fees. Just open a tool and get to work.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-brand-white">Privacy first</h2>
        <p className="mt-2 text-brand-silver">
          All tools run entirely client-side in your browser. Your data is processed locally on your
          device and is never sent to our servers. When you upload a file, it stays on your machine.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-brand-white">Always growing</h2>
        <p className="mt-2 text-brand-silver">
          We are continuously adding new tools across categories including text processing, math and
          conversion, design and color, image editing, developer utilities, QR and barcode generation,
          time and productivity, and document creation.
        </p>
      </div>
    </div>
  );
}
