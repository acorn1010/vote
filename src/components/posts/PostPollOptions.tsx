import { PollOption, PollOptionVote } from '@prisma/client';
import clsx from 'clsx';
import { shuffle, sumBy } from 'lodash';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Button } from '../buttons/Button';

type ExtendedPollOption = PollOption & { userVotes: PollOptionVote[] };

type PostPollOptionsProps = {
  /** The date when this poll ends. */
  endsAt: Date;
  options: ExtendedPollOption[];
  variant: 'inline' | 'fullWidth';
};

export function PostPollOptions(props: PostPollOptionsProps) {
  const { endsAt, options, variant } = props;
  const [isSending, setIsSending] = useState(false);
  const voteOption = trpc.post.voteOption.useMutation();
  const [hasEnded, setHasEnded] = useState(new Date() >= endsAt);
  // Randomize the order of `options` to reduce vote bias. If poll has ended, sort by upvotes.
  const randomizedOptions = useMemo(() => {
    if (hasEnded) {
      return [...options].sort((a, b) => b.upvotesCount - a.upvotesCount);
    }
    return shuffle(options);
  }, [options, hasEnded]);

  const spacing = variant === 'inline' ? 'my-1' : 'my-2';
  const hasVoted = randomizedOptions.some((option) => option.userVotes.length > 0);

  // Set a poll to disabled once the `endsAt` time expires.
  useEffect(() => {
    const now = new Date();
    if (now >= endsAt) {
      setHasEnded(true);
      return;
    }

    const timeout = setTimeout(() => {
      setHasEnded(true);
    }, +endsAt - +now);
    return () => {
      clearTimeout(timeout);
    };
  }, [endsAt, setHasEnded]);

  const winningPoll = hasEnded ? getWinningPoll(randomizedOptions) : null;
  const totalVotes = sumBy(options, (option) => option.upvotesCount);

  return (
    <div
      className={clsx(
        `PostPollOptions flex grid w-full gap-2`,
        variant === 'fullWidth' ? 'flex-col' : 'w-fit',
        spacing
      )}
      style={
        variant === 'inline'
          ? { gridTemplateColumns: `repeat(${randomizedOptions.length}, auto)` }
          : {}
      }
    >
      {randomizedOptions.map((option) => (
        <Button
          key={option.id}
          className={clsx(
            'overflow-hidden overflow-ellipsis whitespace-nowrap py-1 px-2',
            variant === 'fullWidth' && 'pr-12',
            option.userVotes[0]?.pollOptionId === option.id && 'bg-green-500 disabled:bg-green-500',
            hasEnded && winningPoll !== option.id && 'border-neutral-600',
            winningPoll === option.id && 'border-amber-400'
          )}
          style={hasEnded ? getOptionStyle(option.upvotesCount / totalVotes) : {}}
          fullWidth={variant === 'fullWidth'}
          disabled={isSending || hasVoted || hasEnded}
          onClick={async (e) => {
            e.preventDefault();
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
          {variant === 'fullWidth' && (
            <span className="absolute right-2">
              ({Math.round(Math.min(option.upvotesCount / totalVotes, 1) * 100)}%)
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}

/**
 * Returns the special style for this `option`. This includes a background image that displays the
 * % that voted on this option.
 */
function getOptionStyle(percentValue: number): CSSProperties {
  const foreground = 'var(--tw-colors-gray-600)';
  const background = 'var(--tw-colors-slate-800)';
  const percent = Math.min(100 * percentValue, 100);
  return {
    backgroundImage: `linear-gradient(to right, ${foreground}, ${foreground} ${percent}%, ${background} ${percent}%, ${background})`,
  };
}

const MINIMUM_VOTE_COUNT = 2;

function getWinningPoll(options: ExtendedPollOption[]): string | null {
  const [first, second] = [...options].sort((a, b) => b.upvotesCount - a.upvotesCount);
  if (!first || !second || first.upvotesCount < MINIMUM_VOTE_COUNT) {
    return null; // Must have at least 2 options for a winning poll.
  }
  // Requires super-majority of 2x the second place's number of votes (e.g. 66.6%+ in a 2-vote
  // poll).
  return first.upvotesCount >= second.upvotesCount * 2 ? first.id : null;
}
