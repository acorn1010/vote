import { useRouter } from 'next/router';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/containers/Container';
import { Skeleton } from '../components/loading/Skeleton';
import { trpc } from '../utils/trpc';

function useTopicId(): string {
  const result = useRouter().query.topicId ?? '';
  return typeof result === 'string' ? result : result[0] ?? '';
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
  const { isError, isLoading } = trpc.useQuery(['post.getAll', { topicId }]);

  if (isError) {
    return <p>Failed to load posts.</p>;
  } else if (isLoading) {
    return <Skeleton />;
  }

  return <Skeleton />;
}

function CreateNewPollButton(props: { className?: string }) {
  return (
    <Button
      className={props.className}
      fullWidth
      onClick={() => {
        console.log('do something');
      }}
    >
      Create New Poll
    </Button>
  );
}
