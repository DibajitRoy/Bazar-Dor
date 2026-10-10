export const dynamic = "force-dynamic";

const URLS = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

export async function GET() {
  const results = [];

  for (const url of URLS) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      const text = await res.text();

      results.push({
        url: url,
        status: res.status,
        ok: res.ok,
        preview: text.slice(0, 300),
      });
    } catch (error) {
      results.push({
        url: url,
        error: String(error),
        cause: String((error as { cause?: unknown }).cause),
      });
    }
  }

  return Response.json(results);
}