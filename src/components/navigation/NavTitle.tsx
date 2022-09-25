import Link from 'next/link';
import { useRouter } from 'next/router';

export function NavTitle() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-shrink-0 items-center">
        <h1 className="text-neutral-300 hover:text-white">
          <TitleLink />
        </h1>
      </div>
    </div>
  );
}

function TitleLink() {
  const { query } = useRouter();
  const topic = query.topicId;
  if (topic) {
    const url = `/${topic}`;
    return (
      <Link href={url} passHref>
        <a>{url}</a>
      </Link>
    );
  }
  return <>Home</>;
}
