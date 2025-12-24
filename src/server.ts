import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { app } from './api';

const angularApp = new AngularAppEngine();

// Fallback to Angular SSR for all routes
app.all('*', async (c) => {
	// Pass the request to Angular
	// c.req.raw is the standard Request object
	const res = await angularApp.handle(c.req.raw);

	// Return the Angular response, or 404 if Angular didn't handle it
	return res || c.notFound();
});

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req) => {
	// Delegate to Hono to handle routing (both API and Angular pages)
	return app.fetch(req);
});

// Export default for Cloudflare Workers
export default {
	fetch: (req: Request, env: any, ctx: any) => app.fetch(req, env, ctx)
};
