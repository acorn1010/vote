import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { trpc } from '../utils/trpc';

dayjs.extend(relativeTime);
type PostCardProps = {
  topicId: string;
  postId: string;
  title: string;
  upvoteCount: number;
  downvoteCount: number;
  commentsCount: number;
  createdAt: Date;
};
export function PostCard(props: PostCardProps) {
  const {
    postId,
    title,
    upvoteCount,
    downvoteCount,
    commentsCount,
    topicId,
    createdAt,
  } = props;
  return (
    <div className="my-2 flex rounded-md bg-slate-800 p-2">
      <UpvoteDownvote postId={postId} voteCount={upvoteCount + downvoteCount} />
      <div className="flex flex-col">
        <Link href={`/${topicId}/${postId}`}>
          <a>Title: {title}</a>
        </Link>
        <div className="flex">
          <p>submitted {dayjs(createdAt).from(dayjs())}</p>
          <p>{commentsCount} Comments</p>
        </div>
      </div>
    </div>
  );
}

function UpvoteDownvote(props: { postId: string; voteCount: number }) {
  const { postId, voteCount } = props;
  const voteOnPost = trpc.useMutation('post.vote');
  return (
    <div className="flex flex-col">
      <button onClick={() => voteOnPost.mutate({ postId, isUpvote: true })}>
        Upvote
      </button>
      <p>{voteCount}</p>
      <button onClick={() => voteOnPost.mutate({ postId, isUpvote: false })}>
        Downvote
      </button>
    </div>
  );
}
