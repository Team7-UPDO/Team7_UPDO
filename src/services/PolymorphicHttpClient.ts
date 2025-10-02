// src/services/PolymorphicHttpClient.ts

import HttpClient from './HttpClient';

export default class PolymorphicHttpClient extends HttpClient {
  private static pInstance: PolymorphicHttpClient;

  private constructor(baseUrl: string) {
    super(baseUrl);
  }

  public static getInstance(
    baseUrl: string = 'https://fe-adv-project-together-dallaem.vercel.app',
  ) {
    if (!PolymorphicHttpClient.pInstance) {
      PolymorphicHttpClient.pInstance = new PolymorphicHttpClient(baseUrl);
    }
    return PolymorphicHttpClient.pInstance;
  }

  protected async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (typeof window === 'undefined') {
      options.credentials = 'include';
    }
    return super.request<T>(path, options);
  }
}
