import Link from 'next/link';
import { useTopicId } from '../topics/useTopicId';
import { Button } from './Button';

export function CreateNewPollButton(props: { className?: string }) {
  const topicId = useTopicId();

  // Required so that next/router doesn't freak out with '//create' route.
  if (!topicId) {
    return <></>;
  }

  return (
    <Link href={`/${topicId}/create`} passHref>
      <a>
        <Button className={props.className} fullWidth>
          Create New Poll
        </Button>
      </a>
    </Link>
  );
}
