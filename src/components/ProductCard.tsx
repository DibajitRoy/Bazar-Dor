import Link from "next/link";
import ChangeBadge from "./ChangeBadge";
import type { Product } from "@/lib/api";
import { formatNumber } from "@/lib/format";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="card-body gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-base-200 text-2xl">
            {product.emoji}
          </div>
          <div>
            <h3 className="font-bold leading-tight">{product.name}</h3>
            <p className="text-xs text-neutral-500">প্রতি {product.unit}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-neutral-500">আজকের দাম</p>
          <div className="flex items-end justify-between">
            <p className="text-xl font-bold">
              {formatNumber(product.price)}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>
            <ChangeBadge change={product.change} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;