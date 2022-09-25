import { PollOption } from '@prisma/client';
import { shuffle } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Button } from '../../components/buttons/Button';
import { UpvoteDownvote } from '../../components/buttons/UpvoteDownvote';
import { Container } from '../../components/containers/Container';
import { Skeleton } from '../../components/loading/Skeleton';
import { useTopicId } from '../../components/topics/useTopicId';
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
      <PostHead title={data.title} />
      <div className="my-2 flex rounded-md bg-slate-800 p-2">
        <UpvoteDownvote postId={postId} voteCount={data.totalCount} />
        <div className="flex flex-col">
          <h1>{data.title}</h1>
          <p>Posted by {data.user ? data.user.name : 'Anonymous'}</p>
          <PostPollOptions options={data.options} />
          <p>For a different outcome, invite people who share that opinion to vote!</p>
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

function PostPollOptions(props: { options: PollOption[] }) {
  const { options } = props;
  const [isSending, setIsSending] = useState(false);
  const voteOption = trpc.post.voteOption.useMutation();
  // Randomize the order of `options` to reduce vote bias.
  const randomizedOptions = useMemo(() => shuffle(options), [options]);

  return (
    <div className="my-2 flex flex-col gap-2">
      {randomizedOptions.map((option) => (
        <Button
          key={option.id}
          fullWidth
          disabled={isSending}
          onClick={async () => {
            setIsSending(true);
            try {
              await voteOption.mutateAsync({ postId: option.postId, pollOptionId: option.id });
            } catch (e) {
              console.error(e);
            } finally {
              setIsSending(false);
            }
          }}
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
}
