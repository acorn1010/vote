import { z } from 'zod';
import { t } from '../../trpc';
//import { createRouter } from '../context';

export const postRouter = t.router({
  get: t.procedure
    .input( z.object({ postId: z.string().min(1) }) )
    .query(async ({ ctx, input }) => {
      const { postId } = input;

      /** Retrieves all posts for a given topic. */
      return ctx.prisma.post.findUnique({
        where: { id: postId },
        include: {
          _count: {
            select: {
              comments: true,
            },
          },
          options: true,
          user: true,
        },
      });
  }),
  getAll: t.procedure
    .input( z.object({ topicId: z.optional(z.string()) }) )
    .query(async ({ ctx, input }) => {
      /** Retrieves all posts for a given topic. */
      const topicId = input.topicId?.toLowerCase() ?? '';
      return ctx.prisma.post.findMany({
        ...(topicId ? { where: { topicId } } : {}),
        include: {
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      });
    }),
  create: t.procedure
  .input( z.object({
    topicId: z
      .string()
      .min(1)
      .max(255)
      .regex(/[a-zA-Z0-9_-]/),
    title: z.string().min(1).max(255),
    description: z.optional(z.string()),
    type: z.enum(['MULTIPLE_CHOICE', 'IMAGE_POLL'] as const),
  }) )
  .mutation(async ({ ctx, input }) => {
      const { title, description, type } = input;

      // Create a new Topic if one doesn't already exist, or fail.
      const topicId = input.topicId.toLowerCase();
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
              create: [{ text: 'hello world' }, { text: 'does this thing work?' }],
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
  }),
  vote: t.procedure
  .input( z.object({
    postId: z.string().min(1),
    isUpvote: z.boolean(),
  }) )
  .mutation(async ({ ctx, input }) => {
    const { isUpvote, postId } = input;
      // User is voting on a post itself.

      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('You must be signed in to vote.');
      }

      try {
        const magnitude = isUpvote ? 1 : -1;

        // First, handle the removal of any current votes.
        const maybeVote = await ctx.prisma.postVote.findUnique({
          where: { userId_postId: { userId, postId } },
        });
        if (maybeVote) {
          // There was an old vote. Remove it!
          const oldMagnitude = maybeVote.magnitude;
          await ctx.prisma.$transaction([
            ctx.prisma.postVote.delete({
              where: { userId_postId: { userId, postId } },
            }),
            ctx.prisma.post.update({
              where: { id: postId },
              data: {
                totalCount: { decrement: oldMagnitude },
                [oldMagnitude >= 0 ? 'upvotesCount' : 'downvotesCount']: {
                  decrement: 1,
                },
              },
            }),
          ]);

          // User had an old vote, so just remove their vote and return.
          if (oldMagnitude === magnitude) {
            return;
          }
        }

        // Add the new vote
        await ctx.prisma.$transaction([
          ctx.prisma.postVote.create({
            data: { userId, postId, magnitude },
          }),
          ctx.prisma.post.update({
            where: { id: postId },
            data: {
              totalCount: { increment: magnitude },
              [isUpvote ? 'upvotesCount' : 'downvotesCount']: {
                increment: 1,
              },
            },
          }),
        ]);
      } catch (e) {
        console.error(e);
      }
  }),
});
