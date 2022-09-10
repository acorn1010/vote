import { z } from 'zod';
import { createRouter } from '../context';

export const postRouter = createRouter().query('getAll', {
  input: z.object({ topicId: z.string() }),
  async resolve({ ctx, input }) {
    /** Retrieves all posts for a given topic. */
    return ctx.prisma.post.findMany({
      where: { id: input.topicId },
    });
  },
});
