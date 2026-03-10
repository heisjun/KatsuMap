/**
 * A unified fetch client to reduce boilerplate across data fetching functions.
 * It automatically prepends the NEXT_PUBLIC_BASE_URL and standardizes error throwing.
 */
export async function fetchClient<T>(
  endpoint: string,
  options?: RequestInit & { next?: NextFetchRequestConfig }
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
