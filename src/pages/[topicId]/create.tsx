import { useSession } from 'next-auth/react';
import { Container } from '../../components/containers/Container';

export default function Create() {
  // Required: We want to ensure user has signed in so they don't waste time filling out a form
  // that requires authentication to fill out!
  useSession({ required: true });

  return (
    <Container>
      <p>TODO: Create a poll here.</p>
    </Container>
  );
}
