import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { MouseEventHandler, useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';

type UpvoteDownvoteProps = {
  className?: string;
  /** 1 if the user has upvoted this post, -1 if they've downvoted, else 0. */
  userMagnitude: -1 | 0 | 1;
  postId: string;
  /** Number of (upvotes - downvotes) this Post has received so far. */
  voteCount: number;
};

/** Provides an up arrow, down arrow, and total vote count (upvotes + downvotes). */
export function UpvoteDownvote(props: UpvoteDownvoteProps) {
  const { className, postId, userMagnitude, voteCount } = props;
  const voteOnPost = trpc.post.vote.useMutation();
  const [magnitude, setMagnitude] = useState(userMagnitude);

  const makeHandleClick =
    (newMagnitude: -1 | 0 | 1): MouseEventHandler =>
    async (e) => {
      e.preventDefault();
      setMagnitude(newMagnitude);
      await voteOnPost.mutateAsync({ postId, magnitude: newMagnitude });
    };

  useEffect(() => {
    setMagnitude(userMagnitude);
  }, [userMagnitude]);

  const iconClass = clsx(
    'h-7 w-7 text-neutral-500 hover:rounded-sm hover:bg-neutral-700',
    className
  );
  return (
    <div className="mr-2 flex flex-col">
      <button onClick={makeHandleClick(magnitude > 0 ? 0 : 1)}>
        <ChevronUpIcon
          className={clsx(iconClass, 'hover:text-green-400', magnitude > 0 && 'text-green-500')}
          aria-hidden="true"
        />
      </button>
      <p className="my-1 text-center text-sm font-semibold leading-none">
        {voteCount + (magnitude - userMagnitude)}
      </p>
      <button onClick={makeHandleClick(magnitude < 0 ? 0 : -1)}>
        <ChevronDownIcon
          className={clsx(iconClass, 'hover:text-red-400', magnitude < 0 && 'text-red-500')}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
