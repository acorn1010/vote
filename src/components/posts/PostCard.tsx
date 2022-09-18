import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { UpvoteDownvote } from '../buttons/UpvoteDownvote';

dayjs.extend(relativeTime);
type PostCardProps = {
  topicId: string;
  postId: string;
  title: string;
  /** Total of upvotes - downvotes. */
  totalCount: number;
  commentsCount: number;
  createdAt: Date;
};
export function PostCard(props: PostCardProps) {
  const { postId, title, totalCount, commentsCount, topicId, createdAt } =
    props;
  return (
    <div className="my-2 flex rounded-md bg-slate-800 p-2">
      <UpvoteDownvote postId={postId} voteCount={totalCount} />
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
