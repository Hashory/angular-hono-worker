import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc } from 'hono/client';
import type { AppType } from '../../../api';

type HonoClient = ReturnType<typeof hc<AppType>>;

/**
 * Interface merging to allow direct access to RPC routes on ApiService.
 * e.g., apiService.users.$get() instead of apiService.client.users.$get()
 */
export interface ApiService extends HonoClient { }

/**
 * Base class for handling Hono RPC requests.
 * The default implementation uses the browser's fetch API.
 * This is overridden in the server-side configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class HonoRequestHandler {
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    console.log(`[HonoRequestHandler] Executing request: ${input}`);
    return fetch(input, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private handler = inject(HonoRequestHandler);

  private customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Generate a key based on the URL
    const urlStr = input.toString();
    const key = makeStateKey<string>(urlStr);
    console.log(`[ApiService] URL: ${urlStr}, Key: ${key}`);

    // [Browser] Check TransferState cache first
    if (!isPlatformServer(this.platformId)) {
      if (this.transferState.hasKey(key)) {
        const cachedBody = this.transferState.get(key, '');
        // Return a mocked Response with the cached body
        return new Response(cachedBody, { status: 200 });
      }
      // Fallback to network fetch via handler
      return this.handler.fetch(input, init);
    }

    // [Server] Execute request via handler
    const response = await this.handler.fetch(input, init);

    // Cache successful responses
    if (response.ok) {
      const cloned = response.clone();
      const text = await cloned.text();
      this.transferState.set(key, text);
    }

    return response;
  }

  #client = hc<AppType>('/api', {
    fetch: this.customFetch
  });

  constructor() {
    const client = this.#client;
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return (target as any)[prop];
        }
        return (client as any)[prop];
      }
    });
  }

  getCached<T>(url: string): T | undefined {
    const key = makeStateKey<string>(url);
    const cached = this.transferState.get(key, undefined);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        return cached as unknown as T;
      }
    }
    return undefined;
  }
}
