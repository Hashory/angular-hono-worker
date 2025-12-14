import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { hc } from 'hono/client';
import { AppType } from '../hono';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);

  // For SSR, an absolute URL is required. In the browser, a relative URL works.
  // For the development environment, specify localhost:4200 on the server side.
  private baseUrl = isPlatformServer(this.platformId)
    ? 'http://localhost:4200'
    : '/';

  client = hc<AppType>(this.baseUrl);
}
