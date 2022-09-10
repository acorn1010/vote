import {z} from 'zod';
import {createRouter} from '../context';

export const commentRouter = createRouter()
    .query('getAll', {
      input: z.object({postId: z.string()}),
      async resolve({ctx, input}) {
        /** Retrieves all comments for a given post. */
        return ctx.prisma.post.findMany({
          where: {id: input.postId},
        });
      },
    });
