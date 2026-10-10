import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import TrendIcon, { getTrend } from "./TrendIcon";
import { getProducts } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";

const Ticker = async () => {
  const products = await getProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-base-300 bg-base-100 py-2 text-sm">
      <MarqueeText direction="left" duration={80}>
        {products.map((p) => {
          const dir = getTrend(p.change);

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="mx-4 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{p.emoji}</span>
              <span className="font-medium">{p.name}</span>
              <span>
                {formatNumber(p.price)} টাকা/{p.unit}
              </span>
              {dir !== "flat" && (
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    dir === "up" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  <TrendIcon dir={dir} className="size-2.5" />
                  {formatPercent(p.change)}
                </span>
              )}
            </Link>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Ticker;