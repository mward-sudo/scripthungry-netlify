import type { Graphcms_NavigationLink } from '~/generated/graphql.server'

import { NavLink } from './nav-link'

export const MobileDrawer = ({
  navLinks,
}: {
  navLinks: Graphcms_NavigationLink[]
}) => {
  const closeMenu = () => {
    const mobileInput = document.getElementById(
      'mobile-drawer',
    ) as HTMLInputElement
    mobileInput.checked = false
  }

  return (
    <div className='drawer-side'>
      <label htmlFor='mobile-drawer' className='drawer-overlay'></label>
      <ul className='menu w-80 overflow-y-auto bg-base-100 p-4'>
        {navLinks?.map(({ url, linkText }) => (
          <NavLink to={url} key={`mob-nav-link-${url}`} onClick={closeMenu}>
            {linkText}
          </NavLink>
        ))}
      </ul>
    </div>
  )
}
