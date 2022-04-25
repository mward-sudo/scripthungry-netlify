import { Link as RemixLink } from '@remix-run/react'
import type { RemixLinkProps } from '@remix-run/react/components'

/** Used for unknown links that may be external links. If the `to` prop is an external url then
 * render an `a` element, else use the remix `Link` component */
export const UnknownLink = ({ to, children, ...props }: RemixLinkProps) => {
  const filteredProps = () => {
    const { prefetch, reloadDocument, replace, state, ...filteredProps } = props
    return filteredProps
  }
  if (to.toString().startsWith('http')) {
    return (
      <a href={to.toString()} {...filteredProps}>
        {children}
      </a>
    )
  }
  return (
    <RemixLink to={to} {...props}>
      {children}
    </RemixLink>
  )
}
