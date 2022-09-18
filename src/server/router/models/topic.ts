import { createRouter } from '../context';

export const topicRouter = createRouter().query('getTop', {
  async resolve({ ctx }) {
    return ctx.prisma.topic.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { posts: { _count: 'desc' } },
      take: 100,
    });
  },
});
