import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type ButtonProps = {
  className?: string;
  /** True if this Button should be disabled (not clickable). Default false. */
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};
export function Button(props: PropsWithChildren<ButtonProps>) {
  const { className, children, disabled, fullWidth, onClick } = props;
  return (
    <button
      className={clsx(
        'relative rounded-md border border-transparent bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-gray-600',
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
