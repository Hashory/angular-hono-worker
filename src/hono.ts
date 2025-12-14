import { Hono } from 'hono';
import { describeRoute, resolver, validator } from 'hono-openapi'
import * as v from 'valibot'
import { openAPIRouteHandler } from 'hono-openapi'

export const app = new Hono();

const querySchema = v.object({
  name: v.optional(v.string()),
})

const responseSchema = v.string()

app.get(
  '/hono',
  describeRoute({
    description: 'Say hello to the user',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'text/plain': { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  validator('query', querySchema),
  (c) => {
    const query = c.req.valid('query')
    return c.text(`Hello ${query?.name ?? 'Hono'}!`)
  }
)

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Greeting API',
      },
      servers: [
        { url: 'http://localhost:4200', description: 'Local Server' },
      ],
    },
  })
)