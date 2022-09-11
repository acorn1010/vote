import { signIn } from 'next-auth/react';
import { Button } from '../buttons/Button';

export function LogInButton(props: { fullWidth?: boolean }) {
  return (
    <Button
      fullWidth={props.fullWidth}
      onClick={async () => {
        await signIn('discord');
      }}
    >
      Log In
    </Button>
  );
}
