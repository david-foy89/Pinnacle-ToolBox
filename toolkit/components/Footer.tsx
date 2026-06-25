import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-navy-light/40 bg-brand-black">
      <div className="nav-accent-line opacity-60" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div>
            <p className="text-lg font-bold">
              <span className="text-brand-white">Pinnacle</span>{" "}
              <span className="text-brand-orange">Toolbox</span>
            </p>
            <p className="mt-2 text-sm text-brand-silver-muted">
              Free browser-based tools for everyday productivity. No login required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-white">Company</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="text-brand-silver-muted transition hover:text-brand-orange">About</Link></li>
              <li><Link href="/contact" className="text-brand-silver-muted transition hover:text-brand-orange">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-brand-white">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-brand-silver-muted transition hover:text-brand-orange">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-brand-white">Popular Tools</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/tools/json-formatter" className="text-brand-silver-muted transition hover:text-brand-orange">JSON Formatter</Link></li>
              <li><Link href="/tools/word-counter" className="text-brand-silver-muted transition hover:text-brand-orange">Word Counter</Link></li>
              <li><Link href="/tools/qr-generator" className="text-brand-silver-muted transition hover:text-brand-orange">QR Generator</Link></li>
              <li><Link href="/tools/image-compressor" className="text-brand-silver-muted transition hover:text-brand-orange">Image Compressor</Link></li>
              <li><Link href="/tools/password-generator" className="text-brand-silver-muted transition hover:text-brand-orange">Password Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-brand-white">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/sitemap.xml" className="text-brand-silver-muted transition hover:text-brand-orange">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-brand-navy-light/30 pt-6 text-center text-sm text-brand-silver-muted">
          © {new Date().getFullYear()} Pinnacle Toolbox. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
