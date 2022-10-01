import { PollOption, PollOptionVote } from '@prisma/client';
import clsx from 'clsx';
import { shuffle } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Button } from '../buttons/Button';

type PostPollOptionsProps = {
  /** The date when this poll ends. */
  endsAt: Date;
  options: (PollOption & { userVotes: PollOptionVote[] })[];
  variant: 'inline' | 'fullWidth';
};

export function PostPollOptions(props: PostPollOptionsProps) {
  const { endsAt, options, variant } = props;
  const [isSending, setIsSending] = useState(false);
  const voteOption = trpc.post.voteOption.useMutation();
  const [hasEnded, setHasEnded] = useState(new Date() >= endsAt);
  // Randomize the order of `options` to reduce vote bias.
  const randomizedOptions = useMemo(() => shuffle(options), [options]);

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

  return (
    <div className={clsx('flex gap-2', variant === 'fullWidth' && 'flex-col', spacing)}>
      {randomizedOptions.map((option) => (
        <Button
          key={option.id}
          className={clsx(
            'py-1 px-2',
            option.userVotes[0]?.pollOptionId === option.id && 'bg-green-500 disabled:bg-green-500',
            winningPoll === option.id && 'border-amber-400'
          )}
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
        </Button>
      ))}
    </div>
  );
}

const MINIMUM_VOTE_COUNT = 2;
function getWinningPoll(options: (PollOption & { userVotes: PollOptionVote[] })[]): string | null {
  const [first, second] = [...options].sort((a, b) => b.upvotesCount - a.upvotesCount);
  if (!first || !second || first.upvotesCount < MINIMUM_VOTE_COUNT) {
    return null; // Must have at least 2 options for a winning poll.
  }
  // Requires super-majority of 2x the second place's number of votes (e.g. 66.6%+ in a 2-vote poll).
  return first.upvotesCount >= second.upvotesCount * 2 ? first.id : null;
}
