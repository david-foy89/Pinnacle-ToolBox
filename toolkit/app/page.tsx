import { Suspense } from "react";
import HomePage from "@/components/HomePage";
import { generateHomeMetadata, generateHomePageJsonLd } from "@/lib/seo";

export const metadata = generateHomeMetadata();

export default function Page() {
  const jsonLd = generateHomePageJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Suspense fallback={null}>
        <HomePage />
      </Suspense>
    </>
  );
}
