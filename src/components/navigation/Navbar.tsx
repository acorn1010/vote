import {MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import {Disclosure} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {NavTitle} from './NavTitle';

const navigation = [
  {name: 'Home', href: '/', current: true},
  {name: 'Acorn1010', href: '/acorn1010', current: true},
  {name: 'Foony', href: '/foony', current: true},
] as const;

export function Navbar() {
  return (
      <Disclosure as="nav" className="bg-slate-800">
        {({open}) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <MobileMenuButton open={open}/>
                  <NavTitle />
                  <NavSearch />
                </div>
              </div>

              <MobileMenuDropdown />
            </>
        )}
      </Disclosure>
  )
}

function MobileMenuButton(props: { open?: boolean }) {
  const {open} = props;

  return (
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        {/* Mobile menu button */}
        <Disclosure.Button
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span className="sr-only">Open main menu</span>
          {open ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
          ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
          )}
        </Disclosure.Button>
      </div>
  );
}

function MobileMenuDropdown() {
  return (
      <Disclosure.Panel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
              <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={clsx(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Disclosure.Button>
          ))}
        </div>
      </Disclosure.Panel>
  );
}

function NavSearch() {
  return (
      <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
        <div className="w-full max-w-lg lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                id="search"
                name="search"
                className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
                placeholder="Search"
                type="search"
            />
          </div>
        </div>
      </div>
  );
}
