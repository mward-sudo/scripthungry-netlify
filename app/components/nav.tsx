import { Link } from '@remix-run/react'

import type { NavigationLink } from '~/generated/graphql.server'

export const Nav = ({ navLinks }: { navLinks: NavigationLink[] }) => (
  <nav>
    <ul>
      {navLinks.map((navLink) => (
        <li key={`nav-link-${navLink.url}`}>
          <Link to={navLink.url}>{navLink.linkText}</Link>
        </li>
      ))}
    </ul>
  </nav>
)
