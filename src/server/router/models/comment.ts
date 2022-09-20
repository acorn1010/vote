import { z } from 'zod';
import { t } from '../../trpc';

export const commentRouter = t.router({
  getAll: t.procedure
  .input( z.object({ postId: z.string() }) )
  .query(async ({ ctx, input }) => {
    /** Retrieves all comments for a given post. */
    return ctx.prisma.post.findMany({
      where: { id: input.postId },
    });
  })
});