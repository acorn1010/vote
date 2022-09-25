import { z } from 'zod';
import { t } from '../../trpc';

export const commentRouter = t.router({
  getAll: t.procedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    /** Retrieves all comments for a given post. */
    return ctx.prisma.post.findMany({
      where: { id: input.postId },
    });
  }),
  // FIXME(acorn1010): When implementing the ability to create comments, make SURE that you
  //  increment the `commentsCount` in the `Post` table.
});
