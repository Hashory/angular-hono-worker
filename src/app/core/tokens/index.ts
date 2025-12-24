import { InjectionToken } from '@angular/core';

export const HONO_FETCH = new InjectionToken<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>('HONO_FETCH');
