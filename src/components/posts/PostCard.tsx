import { PollOption, PollOptionVote, Post, PostVote } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { sumBy } from 'lodash';
import Link from 'next/link';
import { UpvoteDownvote } from '../buttons/UpvoteDownvote';
import { PostPollOptions } from './PostPollOptions';

dayjs.extend(relativeTime);
type PostCardProps = {
  post: Post & { PostVote: PostVote[]; options: (PollOption & { userVotes: PollOptionVote[] })[] };
};
export function PostCard(props: PostCardProps) {
  const { id, title, totalCount, commentsCount, topicId, options, createdAt, endsAt, PostVote } =
    props.post;

  const userMagnitude = (PostVote[0]?.magnitude ?? 0) as -1 | 0 | 1;

  const totalVotes = sumBy(options, (option) => option.upvotesCount);
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
          <PostPollOptions endsAt={endsAt} options={options} variant="inline" />
          <div className="flex gap-2">
            <p className="text-xs text-neutral-300">
              <span className="font-bold">{totalVotes}</span> Votes
            </p>
            <p className="text-xs text-neutral-500">
              <span className="font-bold">{commentsCount}</span> Comments
            </p>
            <p className="text-xs text-neutral-500">submitted {dayjs(createdAt).from(dayjs())}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
