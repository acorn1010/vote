import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type ContainerProps = {
  className?: string;
};
export function Container(props: PropsWithChildren<ContainerProps>) {
  const { className, children } = props;
  return (
    <div className={clsx('m-auto w-full max-w-screen-lg p-2', className)}>
      {children}
    </div>
  );
}
