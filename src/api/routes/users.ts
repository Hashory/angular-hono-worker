import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import * as v from 'valibot'

const userSchema = v.object({
  id: v.number(),
  name: v.string(),
  email: v.string(),
})

const usersResponseSchema = v.array(userSchema)

const userIdParamSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number)),
})

export const users = new Hono()
  .get(
    '/',
    describeRoute({
      description: 'Get all users',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': { schema: resolver(usersResponseSchema) },
          },
        },
      },
    }),
    (c) => {
      return c.json([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ])
    }
  )
  .get(
    '/:id',
    describeRoute({
      description: 'Get user by ID',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': { schema: resolver(userSchema) },
          },
        },
        404: {
          description: 'User not found',
        },
      },
    }),
    validator('param', userIdParamSchema),
    (c) => {
      const { id } = c.req.valid('param')
      if (id === 1) {
        return c.json({ id: 1, name: 'John Doe', email: 'john@example.com' })
      }
      return c.json({ error: 'User not found' }, 404)
    }
  )

