import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools";
import { generateToolPageJsonLd } from "@/lib/seo";
import AdSlot from "./AdSlot";
import Sidebar from "./Sidebar";
import HowToUse from "./HowToUse";
import FAQ from "./FAQ";
import RelatedTools from "./RelatedTools";

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function ToolLayout({ slug, children }: ToolLayoutProps) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = generateToolPageJsonLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <Sidebar />
        </div>

        <div className="min-w-0 flex-1 lg:max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-silver-muted">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="link-brand">Home</Link></li>
              <li aria-hidden="true" className="text-brand-navy-light">/</li>
              <li>
                <Link
                  href={`/#${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="link-brand"
                >
                  {tool.category}
                </Link>
              </li>
              <li aria-hidden="true" className="text-brand-navy-light">/</li>
              <li className="font-medium text-brand-white" aria-current="page">{tool.name}</li>
            </ol>
          </nav>

          <h1 className="text-2xl font-bold text-brand-white md:text-3xl">{tool.name}</h1>
          <p className="mt-2 text-brand-silver">{tool.description}</p>

          <div className="mt-5">
            <AdSlot size="banner" />
          </div>

          <div className="mt-6 surface-card p-4 md:p-6">
            {children}
          </div>

          <div className="mt-6">
            <AdSlot size="inline" />
          </div>

          <HowToUse steps={tool.howToUse} />
          <FAQ items={tool.faqs} />
          <RelatedTools slugs={tool.relatedTools} />
        </div>

        <div className="hidden w-48 shrink-0 xl:block">
          <AdSlot size="sidebar" />
        </div>
      </div>

      <div className="lg:hidden">
        <Sidebar />
      </div>
    </>
  );
}
