import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HONO_FETCH } from './tokens';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()),
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes), provideClientHydration(withEventReplay()),
  {
    provide: HONO_FETCH,
    useValue: fetch
  }
  ]
};
