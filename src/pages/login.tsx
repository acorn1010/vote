import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { LogInButton } from '../components/auth/LogInButton';
import { Container } from '../components/containers/Container';
import { getServerAuthSession } from '../server/common/get-server-auth-session';

function getForward(forward: string | string[] | undefined) {
  return '' + (forward ?? '');
}

export default function Login() {
  const forward = getForward(useRouter().query.forward);

  return (
    <Container className="max-w-md">
      {forward && (
        <p className="m-4 text-center">You must log in to visit {forward}.</p>
      )}
      <LogInButton fullWidth />
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const forward = getForward(context.query.forward);
  const session = await getServerAuthSession(context);

  // If logged in, redirect to forward.
  if (session) {
    return {
      redirect: {
        destination: forward || '/',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
