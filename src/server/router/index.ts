import { t } from '../trpc';
import { commentRouter } from './models/comment';
import { postRouter } from './models/post';
import { topicRouter } from './models/topic';
import { protectedExampleRouter } from './protected-example-router';

export const appRouter = t.router({
  auth: protectedExampleRouter,
  comment: commentRouter,
  post: postRouter,
  topic: topicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
