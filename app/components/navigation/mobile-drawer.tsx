import type { NavigationLink } from '~/generated/graphql.server'

import { UnknownLink } from '../unknown-link'

export const MobileDrawer = ({ navLinks }: { navLinks: NavigationLink[] }) => (
  <div className='drawer-side'>
    <label htmlFor='my-drawer-3' className='drawer-overlay'></label>
    <ul className='menu w-80 overflow-y-auto bg-base-100 p-4'>
      {navLinks?.map(({ url, linkText }) => (
        <li key={url}>
          <UnknownLink to={url}>{linkText}</UnknownLink>
        </li>
      ))}
    </ul>
  </div>
)
