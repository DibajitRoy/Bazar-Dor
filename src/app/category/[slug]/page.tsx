import CategoryProducts from "@/components/CategoryProducts";
import { notFound } from "next/navigation";
import { getCategory, getProducts } from "@/lib/api";
import { formatNumber } from "@/lib/format";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const category = await getCategory(slug);
  const products = await getProducts(slug);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-5">
        <div className="text-4xl">{category.emoji}</div>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-neutral-600">
            {formatNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <CategoryProducts products={products} />
    </div>
  );
};

export default CategoryPage;