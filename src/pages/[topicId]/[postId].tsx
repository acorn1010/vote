import { useRouter } from 'next/router';
import { UpvoteDownvote } from '../../components/buttons/UpvoteDownvote';
import { Container } from '../../components/containers/Container';
import { Skeleton } from '../../components/loading/Skeleton';
import { trpc } from '../../utils/trpc';

function usePostId(): string {
  return '' + (useRouter().query.postId ?? '');
}

export default function Post() {
  const postId = usePostId();
  const { data } = trpc.post.get.useQuery({ postId });

  if (!data) {
    return <Skeleton />;
  }

  return (
    <Container>
      <div className="my-2 flex rounded-md bg-slate-800 p-2">
        <UpvoteDownvote postId={postId} voteCount={data.totalCount} />
        <div className="flex flex-col">
          <h1>{data.title}</h1>
          <p>Posted by {data.user ? data.user.name : 'Anonymous'}</p>
          <p>TODO(acorn1010): Add poll here.</p>
          <p>For a different outcome, invite people who share that opinion to vote!</p>
        </div>
      </div>
    </Container>
  );
}
