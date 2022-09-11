import { GetServerSidePropsContext } from 'next';
import { Container } from '../../components/containers/Container';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';

export default function Create() {
  return (
    <Container>
      <p>TODO: Create a poll here.</p>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const topicId = '' + (context.query.topicId ?? '');
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/login?forward=/${topicId}/create`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
