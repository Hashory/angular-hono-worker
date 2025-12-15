import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey, Signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc, ClientResponse } from 'hono/client';
import type { AppType } from '../hono';
import { HONO_FETCH } from './tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';

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

  run<T>(
    promise: Promise<ClientResponse<T>>,
    key: string
  ): Signal<T | undefined> {
    const stateKey = makeStateKey<T>(key);

    // Attempt to read synchronous initial value from TransferState
    const initialValue = this.transferState.get(stateKey, undefined);

    // Convert promise to observable, unwrapping the text body
    // Note: Assuming text response based on current usage. 
    // Ideally this would be generic or accept a transform.
    const observable$ = from(promise.then(res => res.text() as unknown as T));

    return toSignal(observable$, { initialValue: initialValue as any }) as Signal<T | undefined>;
  }
}
