const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";


interface ApiMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ApiProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: { dir: string; pct: number };
  markets: ApiMarket[];
}

interface ApiCategory {
  slug: string;
  nameBn: string;
  icon: string;
}



export interface Market {
  name: string;
  division: string;
  min: number;
  max: number;
  avg: number;
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string; 
  categorySlug: string;
  categoryName: string;
  price: number; 
  change: number; 
  previousPrice: number; 
  description: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  markets: Market[];
}


const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};


function toArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) {
    return json as T[];
  }

  if (json && typeof json === "object") {
    const firstArray = Object.values(json).find((v) => Array.isArray(v));
    if (firstArray) {
      return firstArray as T[];
    }
  }

  return [];
}

async function fetchData(path: string): Promise<unknown> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: 600 }, 
    });

    if (!res.ok) {
      console.log("API error:", res.status, path);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.log("API fetch failed:", path, error);
    return null;
  }
}



function makeCategory(item: ApiCategory): Category {
  return {
    slug: item.slug,
    name: item.nameBn,
    emoji: item.icon,
  };
}

function makeProduct(item: ApiProduct): Product {

  let change = Math.abs(item.change?.pct ?? 0);
  if (item.change?.dir === "down") change = -change;
  if (item.change?.dir === "flat") change = 0;


  const markets: Market[] = (item.markets ?? [])
    .map((m) => ({
      name: m.market,
      division: m.division,
      min: m.min,
      max: m.max,
      avg: (m.min + m.max) / 2,
    }))
    .sort((a, b) => a.avg - b.avg);

  
  const minPrice = markets.length
    ? Math.min(...markets.map((m) => m.min))
    : item.today;
  const maxPrice = markets.length
    ? Math.max(...markets.map((m) => m.max))
    : item.today;

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.nameBn,
    emoji: item.image,
    unit: UNIT_BN[item.unit] ?? item.unit,
    categorySlug: item.category,
    categoryName: item.categoryNameBn,
    price: item.today,
    change,
    previousPrice: item.yesterday,
    description: "",
    minPrice,
    maxPrice,
    avgPrice: item.today,
    markets,
  };
}




export async function getCategories(): Promise<Category[]> {
  const json = await fetchData("/categories");
  return toArray<ApiCategory>(json).map(makeCategory);
}


export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}


export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const path = categorySlug ? `/products?category=${categorySlug}` : "/products";
  const json = await fetchData(path);
  return toArray<ApiProduct>(json).map(makeProduct);
}


export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || p.id === slug) ?? null;
}