export function compassApiBase(): string | null {
  return (
    process.env.COMPASS_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null)
  );
}

export async function proxyEngine(
  path: string,
  init?: RequestInit,
  timeoutMs = 30000
): Promise<Response | null> {
  const base = compassApiBase();
  if (!base) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${base}${path}`, { ...init, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}
