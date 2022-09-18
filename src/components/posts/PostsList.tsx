import { trpc } from '../../utils/trpc';
import { Skeleton } from '../loading/Skeleton';
import { PostCard } from './PostCard';
import { useTopicId } from '../topics/useTopicId';

/** Contains a list of posts. Each post is a question or poll for a given topic. */
export function PostsList() {
  const topicId = useTopicId();
  const { isError, isLoading, data } = trpc.useQuery([
    'post.getAll',
    { topicId },
  ]);

  if (isError) {
    return <p>Failed to load posts.</p>;
  } else if (isLoading) {
    return <Skeleton />;
  }

  const posts = [...(data ?? [])].sort(
    (a, z) => z._count.postVotes - a._count.postVotes
  );
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          commentsCount={+post._count.comments}
          postId={post.id}
          upvoteCount={+post._count.postVotes}
          downvoteCount={0}
        />
      ))}
    </div>
  );
}
