import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc } from 'hono/client';
import { app, AppType } from '../hono';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Generate a key based on the URL
    const urlStr = input.toString();
    const key = makeStateKey<string>(urlStr);

    // [Browser] Check TransferState cache first
    if (!isPlatformServer(this.platformId)) {
      if (this.transferState.hasKey(key)) {
        const cachedBody = this.transferState.get(key, '');
        // Return a mocked Response with the cached body
        return new Response(cachedBody, { status: 200 });
      }
      // Fallback to standard network fetch
      return fetch(input, init);
    }

    // [Server] Execute request via internal Hono app
    const response = await app.request(input, init);

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
}
