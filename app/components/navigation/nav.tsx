import { Link } from '@remix-run/react'

import type { NavigationLink } from '~/generated/graphql.server'

import { BurgerButton } from './burger-button'
import { NavLink } from './nav-link'

export const Nav = ({ navLinks }: { navLinks: NavigationLink[] }) => {
  return (
    <div className='sticky top-0 z-50 mb-8 text-base-content'>
      <div className='navbar rounded-box min-h-fit overflow-hidden border-2 border-transparent border-b-neutral/20 border-opacity-50 bg-gradient-to-b from-base-300/80 to-base-300/60 py-0 pl-4 pr-0 backdrop-blur-md'>
        <div className='mr-2 flex-1 px-2'>
          <Link to='/'>scriptHungry</Link>
        </div>
        <div className='flex-none md:hidden'>
          <BurgerButton />
        </div>
        <div className='hidden flex-none md:block'>
          <ul className='menu menu-horizontal'>
            {navLinks.map(({ url, linkText }) => (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <NavLink url={url} linkText={linkText} key={`nav-link-${url}`} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
