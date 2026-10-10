import { parseNumber } from "./format";


// প্রথমটা কাজ না করলে পরেরটায় চেষ্টা করবে
const BASE_URLS = [
  process.env.BAZAR_API_URL?.trim().replace(/\/$/, ""),
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
].filter(Boolean) as string[];

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
  description: string;
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
  previousPrice: number | null;
  description: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  markets: Market[];
}

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const pick = (raw: Raw, keys: string[]): unknown => {
  for (const k of keys) {
    if (raw[k] !== undefined && raw[k] !== null && raw[k] !== "") return raw[k];
  }
  return undefined;
};

const str = (v: unknown, fallback = "") =>
  v === undefined || v === null ? fallback : String(v);

const unwrap = (json: unknown, keys: string[]): unknown => {
  if (isObj(json)) {
    for (const k of keys) {
      if (json[k] !== undefined) return json[k];
    }
  }
  return json;
};


const normalizeCategory = (raw: Raw): Category => ({
  slug: str(pick(raw, ["slug", "id", "key"])),
  name: str(pick(raw, ["nameBn", "name", "title", "label"])),
  emoji: str(pick(raw, ["emoji", "icon"]), "🛒"),
  description: str(pick(raw, ["description", "subtitle"])),
});

const normalizeMarket = (raw: Raw): Market => {
  const min = parseNumber(pick(raw, ["min", "minPrice", "lowest"])) ?? 0;
  const max = parseNumber(pick(raw, ["max", "maxPrice", "highest"])) ?? min;
  const avg =
    parseNumber(pick(raw, ["avg", "average", "avgPrice"])) ?? (min + max) / 2;

  return {
    name: str(pick(raw, ["market", "name", "bazar", "marketName"])),
    division: str(pick(raw, ["division", "region", "city", "location"])),
    min,
    max,
    avg,
  };
};

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
  hali: "হালি",
};

const toBnUnit = (value: unknown): string => {
  const u = str(value, "kg").trim().replace(/^প্রতি\s*/, "");
  return UNIT_BN[u.toLowerCase()] ?? u;
};

const normalizeProduct = (raw: Raw): Product => {
  const price =
    parseNumber(
      pick(raw, ["today", "price", "todayPrice", "currentPrice", "avgPrice"]),
    ) ?? 0;

  const prev = parseNumber(
    pick(raw, ["yesterday", "previousPrice", "yesterdayPrice", "prevPrice"]),
  );

  let change: number | null = null;
  let dir = "";
  const changeRaw = raw["change"];
  if (isObj(changeRaw)) {
    change = parseNumber(pick(changeRaw, ["pct", "percent", "value"]));
    dir = str(pick(changeRaw, ["dir", "direction", "trend"])).toLowerCase();
  } else {
    change = parseNumber(
      pick(raw, ["changePercent", "change_percent", "percentChange", "changePct", "change"]),
    );
    dir = str(pick(raw, ["trend", "direction", "status"])).toLowerCase();
  }
  if (change === null) {
    change = prev && prev > 0 ? ((price - prev) / prev) * 100 : 0;
  }
  if (/down|fall|decrease/.test(dir)) change = -Math.abs(change);
  else if (/up|rise|increase/.test(dir)) change = Math.abs(change);
  else if (/flat|same|none/.test(dir)) change = 0;

  const cat = pick(raw, ["category", "categorySlug"]);
  let categorySlug = "";
  let categoryName = str(pick(raw, ["categoryNameBn", "categoryName", "categoryBn"]));
  if (isObj(cat)) {
    categorySlug = str(pick(cat, ["slug", "id"]));
    categoryName = categoryName || str(pick(cat, ["nameBn", "name", "title"]));
  } else {
    categorySlug = str(cat);
  }

  const marketsRaw = pick(raw, ["markets", "bazars", "marketPrices", "prices"]);
  const markets = Array.isArray(marketsRaw)
    ? marketsRaw
        .filter(isObj)
        .map(normalizeMarket)
        .sort((a, b) => a.avg - b.avg)
    : [];

  const minPrice =
    parseNumber(pick(raw, ["minPrice", "lowestPrice"])) ??
    (markets.length ? Math.min(...markets.map((m) => m.min)) : price);
  const maxPrice =
    parseNumber(pick(raw, ["maxPrice", "highestPrice"])) ??
    (markets.length ? Math.max(...markets.map((m) => m.max)) : price);
  const avgPrice =
    parseNumber(pick(raw, ["avgPrice", "averagePrice", "average"])) ?? price;

  return {
    id: str(pick(raw, ["id", "_id", "slug"])),
    slug: str(pick(raw, ["slug", "id", "_id"])),
    name: str(pick(raw, ["nameBn", "name", "title"])),
    emoji: str(pick(raw, ["image", "emoji", "icon", "categoryIcon"]), "🛒"),
    unit: toBnUnit(pick(raw, ["unitBn", "unit", "unitName"])),
    categorySlug,
    categoryName,
    price,
    change,
    previousPrice: prev,
    description: str(pick(raw, ["description", "summary", "subtitle"])),
    minPrice,
    maxPrice,
    avgPrice,
    markets,
  };
};



const get = async (path: string): Promise<unknown | null> => {
  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (res.ok) {
        return await res.json();
      }

      // Vercel Logs e dekha jabe
      console.log("API error", res.status, `${base}${path}`);
    } catch (error) {
      console.log("API fetch failed", `${base}${path}`, error);
    }
  }
  return null;
};

export const getCategories = async (): Promise<Category[]> => {
  const json = unwrap(await get("/categories"), ["data", "categories", "items"]);
  return Array.isArray(json) ? json.filter(isObj).map(normalizeCategory) : [];
};


export const getCategory = async (slug: string): Promise<Category | null> => {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
};

export const getProducts = async (categorySlug?: string): Promise<Product[]> => {
  const path = categorySlug
    ? `/products?category=${encodeURIComponent(categorySlug)}`
    : "/products";
  const json = unwrap(await get(path), ["data", "products", "items"]);
  return Array.isArray(json) ? json.filter(isObj).map(normalizeProduct) : [];
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || p.id === slug) ?? null;
};