"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import type { Product } from "@/lib/api";
import { formatNumber } from "@/lib/format";

type SortType = "default" | "asc" | "desc";

const CategoryProducts = ({ products }: { products: Product[] }) => {
  const [sort, setSort] = useState<SortType>("default");

  if (products.length === 0) {
    return (
      <EmptyState
        title="কোনো পণ্য পাওয়া যায়নি"
        message="এই ক্যাটাগরিতে এখন কোনো পণ্য নেই।"
      />
    );
  }


  let sorted = products;
  if (sort === "asc") {
    sorted = [...products].sort((a, b) => a.price - b.price);
  }
  if (sort === "desc") {
    sorted = [...products].sort((a, b) => b.price - a.price);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2 rounded-box border border-base-300 bg-base-100 p-4">
        <label htmlFor="sort" className="text-sm text-neutral-600">
          সাজান:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="select select-sm w-auto"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-neutral-600">
        মোট {formatNumber(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;