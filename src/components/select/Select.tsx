import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, PropsWithChildren, ReactElement } from 'react';

type SelectProps = {
  children: Iterable<ReactElement<MenuItemProps>> | ReactElement<MenuItemProps>;
  label: string;
  onChange: (value: string | number) => void;
};
export function Select(props: SelectProps) {
  const { children, label, onChange } = props;

  const menuItems: JSX.Element[] = [];
  for (const child of Array.isArray(children) ? children : [children]) {
    const to = 'to' in child.props ? child.props.to : '';
    const value = 'value' in child.props ? child.props.value : '';
    menuItems.push(
      <MenuItemWrapper onChange={onChange} to={to} value={value}>
        {child}
      </MenuItemWrapper>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-neutral-500 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900">
          {label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-neutral-800 rounded-md bg-neutral-800 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItems}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

type MenuItemWrapperProps = {
  onChange: SelectProps['onChange'];
  to: string;
  value: string | number;
};

function MenuItemWrapper(props: PropsWithChildren<MenuItemWrapperProps>) {
  const { to, value } = props;

  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={to || '#'}
          className={clsx(
            active ? 'text-text-100 bg-neutral-700' : 'bg-neutral-800 text-neutral-300',
            'group flex items-center rounded-md px-4 py-2 text-sm'
          )}
          onClick={() => {
            if (value !== '') {
              props.onChange(value);
            }
          }}
        >
          {props.children}
        </a>
      )}
    </Menu.Item>
  );
}

type MenuItemProps =
  | {
      /** The link that clicking the MenuItem will take you to. */
      to: string;
    }
  | {
      /** The value that will be passed to `Select`'s #onChange when selected. */
      value: string | number;
    };
export function MenuItem(props: PropsWithChildren<MenuItemProps>) {
  return <>{props.children}</>;
}
