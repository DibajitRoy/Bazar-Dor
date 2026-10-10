import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import TrendIcon from "@/components/TrendIcon";
import { getProducts } from "@/lib/api";
import { formatNumber, getBanglaDate } from "@/lib/format";

const Home = async () => {
  const products = await getProducts();

  
  const risers = products
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  
  const fallers = products
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <div className="space-y-10">
      
      <div className="flex flex-col-reverse items-center gap-6 rounded-box border border-base-300 bg-base-100 p-6 md:flex-row md:justify-between">
        <div className="max-w-xl text-center md:text-left">
          <span className="badge badge-success badge-soft">{getBanglaDate()}</span>
          <h1 className="mt-3 text-3xl font-extrabold">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-3 text-neutral-600">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-5">
            সব পণ্য দেখুন
          </a>
        </div>

        <Image
          src="/bazar-hero.png"
          alt="বাজারের ঝুড়ি"
          width={320}
          height={260}
          priority
          className="h-auto w-56 sm:w-72"
        />
      </div>

  
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <TrendIcon dir="up" className="size-3.5 text-red-600" /> আজ দাম বেড়েছে
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {risers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <TrendIcon dir="down" className="size-3.5 text-green-700" /> আজ দাম কমেছে
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fallers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* সব পণ্য */}
      <div id="সব-পণ্য" className="scroll-mt-6">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="mb-4 text-sm text-neutral-600">
          মোট {formatNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;