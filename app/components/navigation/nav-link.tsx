import { NavLink as RemixNavLink } from '@remix-run/react'
import type { ReactNode } from 'react'

export const NavLink = ({
  to,
  onClick,
  children,
}: {
  to: string
  onClick?: () => void
  children: ReactNode
}) => {
  return (
    <li>
      {to.startsWith('http') ? (
        <a href={to} target='_blank' rel='noopener noreferrer'>
          {children}
        </a>
      ) : (
        <RemixNavLink to={to} prefetch='render' onClick={onClick}>
          {children}
        </RemixNavLink>
      )}
    </li>
  )
}
