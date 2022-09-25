import Head from 'next/head';
import { CreateNewPollButton } from '../components/buttons/CreateNewPollButton';
import { Container } from '../components/containers/Container';
import { PostsList } from '../components/posts/PostsList';
import { useTopicId } from '../components/topics/useTopicId';

export default function Topic() {
  return (
    <Container>
      <TopicHead />
      <CreateNewPollButton className="my-2" />
      <PostsList />
    </Container>
  );
}

function TopicHead() {
  const topicId = useTopicId();
  return (
    <Head>
      <title>{topicId} | Vote</title>
    </Head>
  );
}
