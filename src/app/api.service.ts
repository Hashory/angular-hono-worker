import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc, ClientResponse } from 'hono/client';
import type { AppType } from '../hono';
import { HONO_FETCH } from './tokens';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private honoFetch = inject(HONO_FETCH);

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
      // Fallback to standard network fetch
      return this.honoFetch(input, init);
    }

    // [Server] Execute request via injected fetch
    const response = await this.honoFetch(input, init);

    // Cache successful responses
    if (response.ok) {
      const cloned = response.clone();
      const text = await cloned.text();
      this.transferState.set(key, text);
    }

    return response;
  }

  client = hc<AppType>('/', {
    fetch: this.customFetch as any
  });

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
