import { t } from "../../trpc";

export const topicRouter = t.router({
  getTop: t.procedure.query(async ({ ctx }) => {
      return ctx.prisma.topic.findMany({
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { posts: { _count: 'desc' } },
        take: 100,
      });
    }
  ),
});
