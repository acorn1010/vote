import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/containers/Container';
import { Skeleton } from '../components/loading/Skeleton';
import { PostCard } from '../components/PostCard';
import { trpc } from '../utils/trpc';

function useTopicId(): string {
  return '' + (useRouter().query.topicId ?? '');
}

export default function Topic() {
  return (
    <Container>
      <CreateNewPollButton className="mb-2" />
      <Posts />
    </Container>
  );
}

function Posts() {
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
          topicId={topicId}
          upvoteCount={+post._count.postVotes}
          downvoteCount={0}
          title={post.title}
        />
      ))}
    </div>
  );
}

function CreateNewPollButton(props: { className?: string }) {
  const topicId = useTopicId();

  // Required so that next/router doesn't freak out with '//create' route.
  if (!topicId) {
    return <></>;
  }

  return (
    <Link href={`/${topicId}/create`} passHref>
      <a>
        <Button className={props.className} fullWidth>
          Create New Poll
        </Button>
      </a>
    </Link>
  );
}
