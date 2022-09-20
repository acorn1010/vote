import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { trpc } from '../../utils/trpc';

/** Provides an up arrow, down arrow, and total vote count (upvotes + downvotes). */
export function UpvoteDownvote(props: { postId: string; voteCount: number }) {
  const { postId, voteCount } = props;
  const voteOnPost = trpc.post.vote.useMutation();
  return (
    <div className="mr-2 flex flex-col">
      <button onClick={() => voteOnPost.mutate({ postId, isUpvote: true })}>
        <ChevronUpIcon
          className="h-7 w-7 text-neutral-500 hover:rounded-sm hover:bg-neutral-700 hover:text-neutral-100"
          aria-hidden="true"
        />
      </button>
      <p className="my-1 text-center text-sm font-semibold leading-none">{voteCount}</p>
      <button onClick={() => voteOnPost.mutate({ postId, isUpvote: false })}>
        <ChevronDownIcon
          className="h-7 w-7 text-neutral-500 hover:rounded-sm hover:bg-neutral-700 hover:text-neutral-100"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
