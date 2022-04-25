import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import { Nav } from './components/nav'
import type {
  GetNavigationQuery,
  NavigationLink,
} from './generated/graphql.server'
import { GetNavigation } from './generated/graphql.server'
import { graphQlClient } from './lib/graphql.server'
import styles from './styles/app.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

type LoaderData = {
  navLinks: NavigationLink[]
}

export const loader: LoaderFunction = async () => {
  const navigationData: GetNavigationQuery = await graphQlClient.request(
    GetNavigation,
  )
  console.log(navigationData)

  return {
    navLinks: navigationData?.graphcms?.navigationLinks,
  }
}

export const App = () => {
  const { navLinks }: LoaderData = useLoaderData()
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Nav navLinks={navLinks} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
