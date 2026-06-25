import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ToolCategory } from "@/lib/types";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  category: ToolCategory;
}

export default function ToolCard({ icon: Icon, title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="tool-card group flex flex-col"
      title={`Free ${title} — open online tool`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red ring-1 ring-brand-red/20 transition group-hover:bg-brand-blue/15 group-hover:text-brand-blue group-hover:ring-brand-blue/30">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mb-1 font-semibold text-brand-white transition group-hover:text-brand-orange">{title}</h3>
      <p className="text-sm leading-relaxed text-brand-silver-muted line-clamp-2">{description}</p>
    </Link>
  );
}
