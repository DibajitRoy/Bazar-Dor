import Link from "next/link";
import { notFound } from "next/navigation";
import ChangeBadge from "@/components/ChangeBadge";
import { getProduct } from "@/lib/api";
import { formatNumber, formatTaka } from "@/lib/format";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

 
  const minMarket = product.markets.find((m) => m.min === product.minPrice);
  const maxMarket = product.markets.find((m) => m.max === product.maxPrice);


  const diff = product.previousPrice
    ? Math.abs(product.price - product.previousPrice)
    : 0;

  const summaryLine =
    product.description ||
    (product.change === 0
      ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
      : `গতকালের তুলনায় আজ দাম ${
          product.change > 0 ? "বেড়েছে" : "কমেছে"
        } · ${formatTaka(diff)}`);

  return (
    <div className="space-y-5">
      {/* breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/">হোম</Link>
          </li>
          <li>
            <Link href={`/category/${product.categorySlug}`}>
              {product.categoryName}
            </Link>
          </li>
          <li>{product.name}</li>
        </ul>
      </div>

      {/* product summary */}
      <div className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-base-200 text-4xl">
            {product.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
              <span>প্রতি {product.unit}</span>
              <span className="badge badge-outline badge-sm">
                {product.categoryName}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-600">{summaryLine}</p>
          </div>
        </div>

        <div className="rounded-box bg-base-200 px-6 py-3 text-center">
          <p className="text-xs text-neutral-600">আজকের দাম</p>
          <p className="text-3xl font-extrabold">{formatNumber(product.price)}</p>
          <p className="mb-1 text-xs text-neutral-600">টাকা / {product.unit}</p>
          <ChangeBadge change={product.change} />
        </div>
      </div>

      {/* price summary */}
      <div className="rounded-box border border-base-300 bg-base-100 p-5">
        <h2 className="mb-4 text-lg font-bold">দামের সারসংক্ষেপ</h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-box border border-base-300 p-4">
            <p className="text-xs text-neutral-600">সর্বনিম্ন দাম</p>
            <p className="text-lg font-bold text-green-700">
              {formatTaka(product.minPrice)}
            </p>
            <p className="text-xs text-neutral-500">
              {minMarket ? minMarket.name : "সবচেয়ে কম দামের বাজার"}
            </p>
          </div>

          <div className="rounded-box border border-base-300 p-4">
            <p className="text-xs text-neutral-600">সর্বাধিক দাম</p>
            <p className="text-lg font-bold text-red-600">
              {formatTaka(product.maxPrice)}
            </p>
            <p className="text-xs text-neutral-500">
              {maxMarket ? maxMarket.name : "সবচেয়ে বেশি দামের বাজার"}
            </p>
          </div>

          <div className="rounded-box border border-base-300 p-4">
            <p className="text-xs text-neutral-600">গড় দাম</p>
            <p className="text-lg font-bold text-green-700">
              {formatTaka(product.avgPrice)}
            </p>
            <p className="text-xs text-neutral-500">
              প্রতি {product.unit}-এর হিসাবে
            </p>
          </div>
        </div>

        {/* market wise price */}
        <h2 className="mb-3 mt-6 text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>

        {product.markets.length === 0 ? (
          <p className="text-sm text-neutral-600">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto rounded-box border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th className="text-right">সর্বনিম্ন</th>
                  <th className="text-right">সর্বাধিক</th>
                  <th className="text-right">গড়</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((m, i) => (
                  <tr key={i} className="hover:bg-base-200">
                    <td>{m.name}</td>
                    <td>{m.division}</td>
                    <td className="text-right">{formatTaka(m.min)}</td>
                    <td className="text-right">{formatTaka(m.max)}</td>
                    <td className="text-right font-bold">{formatTaka(m.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;