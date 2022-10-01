import { PollOption } from '@prisma/client';
import { shuffle } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Button } from '../../components/buttons/Button';
import { UpvoteDownvote } from '../../components/buttons/UpvoteDownvote';
import { Container } from '../../components/containers/Container';
import { Skeleton } from '../../components/loading/Skeleton';
import { PostPollOptions } from '../../components/posts/PostPollOptions';
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
        <UpvoteDownvote
          postId={postId}
          voteCount={data.totalCount}
          userMagnitude={(data.PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1}
        />
        <div className="flex flex-col">
          <h1>{data.title}</h1>
          <p>Posted by {data.user ? data.user.name : 'Anonymous'}</p>
          <PostPollOptions options={data.options} variant="fullWidth" />
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
