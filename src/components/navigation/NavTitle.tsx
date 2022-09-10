import { useRouter } from 'next/router';

export function NavTitle() {
  const { query } = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-shrink-0 items-center">
        <h1>{query.topicId ?? 'Home'}</h1>
      </div>
    </div>
  );
}
