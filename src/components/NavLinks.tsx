"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/api";

const NavLinks = ({ categories }: { categories: Category[] }) => {
  const pathname = usePathname();

  return (
    <nav className="flex">
      <div className="mx-auto flex max-w-full gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const active = pathname === `/category/${c.slug}`;

          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-primary-content shadow"
                  : "text-neutral-700 hover:bg-base-200"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavLinks;