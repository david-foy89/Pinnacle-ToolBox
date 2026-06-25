"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Shield, Zap, Globe } from "lucide-react";
import { tools, getToolCount } from "@/lib/tools";
import { CATEGORY_ORDER } from "@/lib/types";
import ToolCard from "@/components/ToolCard";

const HERO_FEATURES = [
  { icon: Zap, label: "Instant results" },
  { icon: Shield, label: "Private & secure" },
  { icon: Globe, label: "Works in browser" },
] as const;

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState(() => searchParams.get("q") ?? "");
  const count = getToolCount();

  useEffect(() => {
    setFilter(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateFilter = (value: string) => {
    setFilter(value);
    const trimmed = value.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase().trim();
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.slug.replace(/-/g, " ").includes(q)
    );
  }, [filter]);

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      tools: filtered.filter((t) => t.category === cat),
    })).filter((g) => g.tools.length > 0);
  }, [filtered]);

  return (
    <div>
      <section className="hero-gradient relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-glow-red" aria-hidden />
        <div className="pointer-events-none absolute inset-0 hero-glow-blue" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:pb-24 sm:pt-10 md:pb-28">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="flex justify-center lg:justify-end">
              <img
                src="/logo.png"
                alt="Pinnacle Toolbox — free online tools"
                className="relative z-10 w-[min(88vw,20rem)] object-contain drop-shadow-[0_20px_80px_rgba(229,48,15,0.35)] sm:w-[min(80vw,24rem)] lg:w-full lg:max-w-md xl:max-w-lg"
                width={640}
                height={640}
              />
            </div>

            <div className="hero-panel hero-panel-side relative z-20">
              <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
                <span className="badge-gold">{count} Free Tools</span>
                <span className="hero-pill">No login required</span>
                <span className="hero-pill">100% client-side</span>
              </div>

              <h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-brand-white sm:text-3xl md:text-4xl">
                Free Online Tools — Fast, Simple, Private
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-brand-silver sm:text-base">
                Text, images, code, math, documents, and productivity — all in your browser, no account needed.
              </p>

              <div className="mt-7">
                <label htmlFor="home-search" className="sr-only">
                  Search free online tools
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-blue"
                    aria-hidden
                  />
                  <input
                    id="home-search"
                    type="search"
                    name="q"
                    placeholder="Search tools by name or category..."
                    value={filter}
                    onChange={(e) => updateFilter(e.target.value)}
                    className="hero-search"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-brand-silver-muted">
                  {filter
                    ? `Showing ${filtered.length} of ${count} tools`
                    : "Start typing to filter the tool grid below"}
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-brand-navy-light/30 pt-5">
                {HERO_FEATURES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-brand-silver">
                    <Icon className="h-4 w-4 text-brand-orange" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hero-fade-bottom" aria-hidden />
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10">
        {grouped.map(({ category, tools: catTools }) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="mb-14"
            aria-labelledby={`category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <h2
              id={`category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="section-title mb-6"
            >
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  icon={tool.icon}
                  title={tool.name}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  category={tool.category}
                />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-brand-silver-muted">No tools match your search.</p>
        )}
      </div>
    </div>
  );
}
