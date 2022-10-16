import Head from 'next/head';
import { useRouter } from 'next/router';
import { UpvoteDownvote } from '../../components/buttons/UpvoteDownvote';
import { Container } from '../../components/containers/Container';
import { Skeleton } from '../../components/loading/Skeleton';
import { PostPoll } from '../../components/posts/PostPoll';
import { useTopicId } from '../../components/topics/useTopicId';
import { trpc } from '../../utils/trpc';

function usePostId(): string {
  return '' + (useRouter().query.postId ?? '');
}

export default function Post() {
  const postId = usePostId();
  const { data: post } = trpc.post.get.useQuery({ postId });

  if (!post) {
    return <Skeleton />;
  }

  return (
    <Container>
      <PostHead title={post.title} />
      <div className="my-2 flex rounded-md bg-slate-800 p-2">
        <UpvoteDownvote
          postId={postId}
          voteCount={post.totalCount}
          userMagnitude={(post.PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1}
        />
        <div className="flex w-full flex-col">
          <h1 className="text-lg font-semibold">{post.title}</h1>
          <p className="-mt-1 text-sm text-neutral-500">
            Posted by {post.user ? post.user.name : 'Anonymous'}
          </p>
          {post.description && <p className="text-neutral-400">{post.description}</p>}
          <PostPoll post={post} variant="fullWidth" />
        </div>
      </div>
    </Container>
  );
}

function PostHead({ title }: { title: string }) {
  const topicId = useTopicId();
  return (
    <Head>
      <title>
        {title} | {topicId} | Vote
      </title>
    </Head>
  );
}
