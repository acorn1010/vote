import { PollOption, PollOptionVote, Post, PostVote } from '@prisma/client';
import Link from 'next/link';
import { UpvoteDownvote } from '../buttons/UpvoteDownvote';
import { PostPoll } from './PostPoll';

type PostCardProps = {
  post: Post & { PostVote: PostVote[]; options: (PollOption & { userVotes: PollOptionVote[] })[] };
};
export function PostCard(props: PostCardProps) {
  const { id, title, totalCount, topicId, PostVote } = props.post;

  const userMagnitude = (PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1;

  return (
    <Link href={`/${topicId}/${id}`}>
      <div className="group my-2 flex cursor-pointer rounded-md bg-neutral-800 p-2 hover:bg-neutral-700">
        <UpvoteDownvote
          className="hover:bg-neutral-600"
          postId={id}
          userMagnitude={userMagnitude}
          voteCount={totalCount}
        />
        <div className="flex flex-col">
          <a className="flex-grow text-lg text-neutral-300 group-hover:text-white">{title}</a>
          <div className="flex gap-2"></div>
          <PostPoll post={props.post} variant="inline" />
        </div>
      </div>
    </Link>
  );
}
