import { z } from 'zod';
import { createRouter } from '../context';

export const postRouter = createRouter()
  .query('getAll', {
    input: z.object({ topicId: z.string() }),
    async resolve({ ctx, input }) {
      /** Retrieves all posts for a given topic. */
      return ctx.prisma.post.findMany({
        where: { topicId: input.topicId },
        include: {
          _count: {
            select: {
              comments: true,
              postVotes: true,
            },
          },
          postVotes: {
            where: { magnitude: 1 },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      });
    },
  })
  .mutation('create', {
    input: z.object({
      topicId: z.string().min(1),
      title: z.string().min(1).max(255),
      description: z.optional(z.string()),
      type: z.enum(['MULTIPLE_CHOICE', 'IMAGE_POLL'] as const),
    }),
    async resolve({ ctx, input }) {
      const { topicId, title, description, type } = input;

      // Create a new Topic if one doesn't already exist, or fail.
      await ctx.prisma.topic
        .create({
          data: { id: topicId },
        })
        .catch(() => ({}));

      try {
        const userId = ctx.session?.user?.id;
        const { id } = await ctx.prisma.post.create({
          data: {
            title,
            description,
            type,
            topicId,
            userId,
            options: {
              create: [
                { text: 'hello world' },
                { text: 'does this thing work?' },
              ],
            },
          },
          include: {
            options: true,
          },
        });
        return { id, title };
      } catch (e) {
        console.error('Failed to create post.', e);
      }

      throw new Error('Failed to create post.');
    },
  })
  .mutation('vote', {
    input: z.object({
      postId: z.string().min(1),
      isUpvote: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const { isUpvote, postId } = input;
      // User is voting on a post itself.

      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('You must be signed in to vote.');
      }

      try {
        const magnitude = isUpvote ? 1 : -1;
        await ctx.prisma.postVote.upsert({
          where: { postId_userId: { postId, userId } },
          update: { postId, userId, magnitude },
          create: { postId, userId, magnitude },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });
