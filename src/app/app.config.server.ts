import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { HONO_FETCH } from './tokens';
import { app } from '../hono';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: HONO_FETCH,
      useValue: async (input: RequestInfo | URL, init?: RequestInit) => {
        return app.request(input.toString(), init);
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
