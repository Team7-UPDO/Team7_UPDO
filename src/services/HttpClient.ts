// src/services/HttpClient.ts
export default class HttpClient {
  private static instance: HttpClient;
  private baseUrl: string;

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // baseUrl을 적합한 url로 변경하여 설정.
  public static getInstance(
    baseUrl: string = 'https://fe-adv-project-together-dallaem.vercel.app',
  ) {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(baseUrl);
    }
    return HttpClient.instance;
  }

  protected async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { body } = options;

    const headers =
      body instanceof FormData
        ? options.headers || {}
        : {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          };

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw { status: res.status, ...errorBody };
    }

    return res.json() as Promise<T>;
  }

  public get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const query = params
      ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}`
      : '';
    return this.request<T>(`${path}${query}`, { method: 'GET' });
  }

  public post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
