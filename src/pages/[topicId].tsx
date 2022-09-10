import {useRouter} from 'next/router';

export default function Topic() {
  const {query} = useRouter();
  return (
      <p>Topic: {query.topicId}</p>
  );
}
