const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

type ApiOptions = RequestInit & { token?: string | null };

export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}

export async function api<T>(path: string, { token, headers, ...options }: ApiOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    });
  } catch {
    throw new ApiError("The store service is unavailable. Please retry.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.message || "Request failed", response.status);
  return body as T;
}

export const apiUrl = BASE_URL;
