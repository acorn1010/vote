import { PollOption, PollOptionVote } from '@prisma/client';
import clsx from 'clsx';
import { shuffle, sumBy } from 'lodash';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Button } from '../buttons/Button';
import { Tooltip } from '../tooltip/Tooltip';

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
      {randomizedOptions.map((option) => {
        const isWinner = winningPoll === option.id;
        return (
          <PostPollOption
            key={option.id}
            option={option}
            hasEnded={hasEnded}
            isWinner={isWinner}
            totalVotes={totalVotes}
            variant={variant}
            disabled={isSending || hasVoted || hasEnded}
            setIsSending={setIsSending}
          />
        );
      })}
    </div>
  );
}

type PostPollOptionProps = {
  option: ExtendedPollOption;
  hasEnded: boolean;
  isWinner: boolean;
  totalVotes: number;
  variant: PostPollOptionsProps['variant'];
  disabled: boolean;
  setIsSending: (isSending: boolean) => void;
};
function PostPollOption(props: PostPollOptionProps) {
  const { option, hasEnded, isWinner, totalVotes, variant, disabled, setIsSending } = props;
  const percent = totalVotes ? Math.round(Math.min(option.upvotesCount / totalVotes, 1) * 100) : 0;
  const voteOption = trpc.post.voteOption.useMutation();
  const [hasVoted, setHasVoted] = useState(false); // True if user has voted on this option.

  const hasVotedOnOption = hasVoted || option.userVotes[0]?.pollOptionId === option.id;

  const percentText = percent ? ` (${percent}%)` : '';
  return (
    <Tooltip
      key={option.id}
      title={hasEnded ? `${isWinner ? '🏆 ' : ''}${option.upvotesCount} votes${percentText}` : ''}
    >
      <Button
        className={clsx(
          'overflow-hidden overflow-ellipsis whitespace-nowrap py-1 px-2',
          variant === 'fullWidth' && 'pr-12',
          hasVotedOnOption && 'bg-green-500 disabled:bg-green-500',
          hasEnded && !isWinner && 'border-neutral-600',
          isWinner && 'border-amber-400'
        )}
        style={hasEnded ? getOptionStyle(option.upvotesCount / totalVotes) : {}}
        fullWidth={variant === 'fullWidth'}
        disabled={disabled}
        onClick={async (e) => {
          e.preventDefault();
          setIsSending(true);
          setHasVoted(true);
          try {
            await voteOption.mutateAsync({ postId: option.postId, pollOptionId: option.id });
          } catch (e) {
            console.error(e);
            setHasVoted(false);
            // Failed to send. Undo. Only undo in catch-clause because we want the other options to
            // remain disabled after voting.
            setIsSending(false);
          }
        }}
      >
        {option.text}
        {variant === 'fullWidth' && hasEnded && (
          <span className="absolute right-2">({percent}%)</span>
        )}
      </Button>
    </Tooltip>
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
