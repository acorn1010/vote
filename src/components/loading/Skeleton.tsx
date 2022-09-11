import clsx from 'clsx';

/** Provides a simple rectangular skeleton for use when a component is loading. */
export function Skeleton(props: { className?: string }) {
  const { className } = props;
  return (
    <div
      className={clsx(
        'h-8 w-full animate-pulse rounded-md bg-neutral-700',
        className
      )}
    />
  );
}
