import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type ButtonProps = {
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
};
export function Button(props: PropsWithChildren<ButtonProps>) {
  const { className, children, fullWidth, onClick } = props;
  return (
    <button
      className={clsx(
        'relative m-2 rounded-md border border-transparent bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-800',
        fullWidth && 'w-[calc(100%-theme(space.4))]',
        className
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
