import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req) => {
  const res = await angularApp.handle(req);

  return res ?? new Response('Page not found.', { status: 404 });
});

// Export default for Cloudflare Workers
export default {
  fetch: async (req: Request, env: any, ctx: any) => {
    const res = await angularApp.handle(req, { env, ctx });

    return res ?? new Response('Page not found.', { status: 404 });
  },
};
