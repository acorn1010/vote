import { PropsWithChildren } from 'react';

export function Container(props: PropsWithChildren<{}>) {
  return (
    <div className="m-auto w-full max-w-screen-lg p-2">{props.children}</div>
  );
}
