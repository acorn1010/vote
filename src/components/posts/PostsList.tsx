import { trpc } from '../../utils/trpc';
import { Skeleton } from '../loading/Skeleton';
import { PostCard } from './PostCard';
import { useTopicId } from '../topics/useTopicId';

/** Contains a list of posts. Each post is a question or poll for a given topic. */
export function PostsList() {
  const topicId = useTopicId();
  const { isError, isLoading, data } = trpc.post.getAll.useQuery({ topicId });

  if (isError) {
    return <p>Failed to load posts.</p>;
  } else if (isLoading) {
    return <Skeleton />;
  }

  const posts = [...(data ?? [])].sort((a, z) => z.totalCount - a.totalCount);
  return (
    <div id="PostsList">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          commentsCount={post.commentsCount}
          postId={post.id}
          options={post.options}
          totalCount={post.totalCount}
          userMagnitude={(post.PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1}
        />
      ))}
    </div>
  );
}
