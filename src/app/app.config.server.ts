import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { HonoRequestHandler } from './core/services/api.service';
import { ServerHonoRequestHandler } from './core/services/api.service.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: HonoRequestHandler,
      useClass: ServerHonoRequestHandler
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
