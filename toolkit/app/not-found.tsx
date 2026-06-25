import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-white">Page not found</h1>
      <p className="mt-3 text-brand-silver">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-6">
          Back to home
        </Link>
        <Link href="/contact" className="btn-secondary px-6">
          Contact us
        </Link>
      </div>
    </div>
  );
}
