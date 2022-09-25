import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { MouseEventHandler } from 'react';
import { trpc } from '../../utils/trpc';

/** Provides an up arrow, down arrow, and total vote count (upvotes + downvotes). */
export function UpvoteDownvote(props: { className?: string; postId: string; voteCount: number }) {
  const { className, postId, voteCount } = props;
  const voteOnPost = trpc.post.vote.useMutation();

  const makeHandleClick =
    (isUpvote: boolean): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      voteOnPost.mutate({ postId, isUpvote });
    };

  const iconClass = clsx(
    'h-7 w-7 text-neutral-500 hover:rounded-sm hover:bg-neutral-700 hover:text-neutral-100',
    className
  );
  return (
    <div className="mr-2 flex flex-col">
      <button onClick={makeHandleClick(true)}>
        <ChevronUpIcon className={iconClass} aria-hidden="true" />
      </button>
      <p className="my-1 text-center text-sm font-semibold leading-none">{voteCount}</p>
      <button onClick={makeHandleClick(false)}>
        <ChevronDownIcon className={iconClass} aria-hidden="true" />
      </button>
    </div>
  );
}
