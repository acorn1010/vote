import { useRouter } from 'next/router';

export function useTopicId(): string {
  return '' + (useRouter().query.topicId ?? '');
}
