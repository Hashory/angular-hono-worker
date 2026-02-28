import { Injectable, inject, REQUEST_CONTEXT } from '@angular/core';
import { HonoRequestHandler } from './api.service';
import { app } from '../../../api';

/**
 * Server-side implementation of HonoRequestHandler.
 * This class directly calls the Hono app instance, avoiding network overhead during SSR.
 * This file is suffix with .server.ts and excluded from the browser build.
 */
@Injectable()
export class ServerHonoRequestHandler extends HonoRequestHandler {
  #requestContext = inject(REQUEST_CONTEXT);

  override async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    console.log(`[ServerHonoRequestHandler] Executing internal request: ${input}`);

    // @ts-ignore
    const env = this.#requestContext?.env;
    console.log(`requestContext: ${this.#requestContext}`);
    console.log(`env: ${env}`);
    console.log(`env-HELLO: ${env.HELLO}`);

    return app.request(input.toString() + '?abc=123', init, env);
  }
}
