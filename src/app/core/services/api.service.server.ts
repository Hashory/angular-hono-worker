import { Injectable } from '@angular/core';
import { HonoRequestHandler } from './api.service';
import { app } from '../../../api';

/**
 * Server-side implementation of HonoRequestHandler.
 * This class directly calls the Hono app instance, avoiding network overhead during SSR.
 * This file is suffix with .server.ts and excluded from the browser build.
 */
@Injectable()
export class ServerHonoRequestHandler extends HonoRequestHandler {
  override async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    console.log(`[ServerHonoRequestHandler] Executing internal request: ${input}`);
    return app.request(input.toString(), init);
  }
}
