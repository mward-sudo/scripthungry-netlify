import { UnknownLink } from '../unknown-link'

export const NavLink = ({
  url,
  linkText,
}: {
  url: string
  linkText: string
}) => (
  <li>
    <UnknownLink to={url} className='py-4' prefetch='intent' aria-live='polite'>
      {linkText}
    </UnknownLink>
  </li>
)
