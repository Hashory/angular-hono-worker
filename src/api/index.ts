import { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi'
import { users } from './routes/users'
import { posts } from './routes/posts'

const api = new Hono();

// Mount routes to sub-router
const routes = api
  .route('/users', users)
  .route('/posts', posts)

// API-level OpenAPI
api.get(
  '/openapi',
  openAPIRouteHandler(api, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Demo API for Angular + Hono',
      },
      servers: [
        { url: 'http://localhost:4200/api', description: 'Local API Server' },
      ],
    },
  })
)

export const app = new Hono().route('/api', routes);

export type AppType = typeof routes;
