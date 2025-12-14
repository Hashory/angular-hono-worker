import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc } from 'hono/client';
import { app, AppType } from '../hono';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);

  client = hc<AppType>('/', {
    fetch: isPlatformServer(this.platformId)
      ? (input: any, init?: any) => app.request(input, init)
      : undefined
  });
}
