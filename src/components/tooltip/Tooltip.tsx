import { PropsWithChildren, useState } from 'react';
import { usePopper } from 'react-popper';

export function Tooltip(props: PropsWithChildren<{ title: string }>) {
  const { children, title } = props;
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [popperRef, setPopperRef] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(ref, popperRef, {
    // m-1 in Tailwind. Popper doesn't like margin, so we do this nasty thing instead.
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
  });

  if (!title) {
    return <>{children}</>;
  }

  return (
    <div
      className="Tooltip relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={setRef}
    >
      {children}

      <div
        ref={setPopperRef}
        style={styles.popper}
        {...attributes.popper}
        className={`pointer-events-none z-50 w-max max-w-xs rounded-md bg-black p-2 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {title && <p>{title}</p>}
      </div>
    </div>
  );
}
