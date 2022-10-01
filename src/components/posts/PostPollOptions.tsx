import { PollOption, PollOptionVote } from '@prisma/client';
import clsx from 'clsx';
import { shuffle } from 'lodash';
import { useMemo, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Button } from '../buttons/Button';

type PostPollOptionsProps = {
  options: (PollOption & { userVotes: PollOptionVote[] })[];
  variant: 'inline' | 'fullWidth';
};

export function PostPollOptions(props: PostPollOptionsProps) {
  const { options, variant } = props;
  const [isSending, setIsSending] = useState(false);
  const voteOption = trpc.post.voteOption.useMutation();
  // Randomize the order of `options` to reduce vote bias.
  const randomizedOptions = useMemo(() => shuffle(options), [options]);

  const spacing = variant === 'inline' ? 'my-1' : 'my-2';
  const hasVoted = randomizedOptions.some((option) => option.userVotes.length > 0);
  return (
    <div className={clsx('flex gap-2', variant === 'fullWidth' && 'flex-col', spacing)}>
      {randomizedOptions.map((option) => (
        <Button
          key={option.id}
          className={clsx(
            'py-1 px-2',
            option.userVotes[0]?.pollOptionId === option.id && 'bg-green-500 disabled:bg-green-500'
          )}
          fullWidth={variant === 'fullWidth'}
          disabled={isSending || hasVoted}
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
