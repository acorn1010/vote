import { createRouter } from './context';
import superjson from 'superjson';

import { commentRouter } from './models/comment';
import { postRouter } from './models/post';
import { topicRouter } from './models/topic';
import { protectedExampleRouter } from './protected-example-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', protectedExampleRouter)
  .merge('comment.', commentRouter)
  .merge('post.', postRouter)
  .merge('topic.', topicRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
