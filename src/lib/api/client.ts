// src/lib/api/client.ts

const BASE_URL = "https://fe-adv-project-together-dallaem.vercel.app";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      ...errorBody,
    };
  }

  return res.json() as Promise<T>;
}
