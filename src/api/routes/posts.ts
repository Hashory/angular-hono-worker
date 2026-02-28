import { Hono } from 'hono';
import { describeRoute, resolver, validator } from 'hono-openapi';
import * as v from 'valibot';

const postSchema = v.object({
  id: v.number(),
  title: v.string(),
  content: v.string(),
  authorId: v.number(),
});

const postsResponseSchema = v.array(postSchema);

const createPostSchema = v.object({
  title: v.string(),
  content: v.string(),
  authorId: v.number(),
});

export const posts = new Hono()
  .get(
    '/',
    describeRoute({
      description: 'Get all posts',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': { schema: resolver(postsResponseSchema) },
          },
        },
      },
    }),
    (c) => {
      // @ts-ignore
      console.log(c.env.HELLO);
      return c.json([
        { id: 101, title: 'Hello Hono', content: 'Hono is fast!', authorId: 1 },
        { id: 102, title: 'Angular + Hono', content: 'Great combination.', authorId: 2 },
      ]);
    },
  )
  .post(
    '/',
    describeRoute({
      description: 'Create a new post',
      responses: {
        201: {
          description: 'Post created',
          content: {
            'application/json': { schema: resolver(postSchema) },
          },
        },
      },
    }),
    validator('json', createPostSchema),
    (c) => {
      // @ts-ignore
      console.log(c.env.HELLO);
      const data = c.req.valid('json');
      return c.json({ id: 103, ...data }, 201);
    },
  );
