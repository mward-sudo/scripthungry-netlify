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

import { Footer } from './components/footer'
import { MobileDrawer } from './components/navigation/mobile-drawer'
import { Nav } from './components/navigation/nav'
import { site } from './config'
import type {
  GetNavigationQuery,
  Graphcms_NavigationLink,
} from './generated/graphql.server'
import { GetNavigation } from './generated/graphql.server'
import { graphQlClient } from './lib/graphql.server'
import styles from './styles/app.css'

export const meta: MetaFunction = ({ location }) => ({
  charset: 'utf-8',
  title: `Super fast cloud web sites | ${site.name}`,
  description: site.description,
  robots: 'index, follow',
  canonical: `${site.url}${location.pathname}`,
  viewport: 'width=device-width,initial-scale=1',
})

export const links = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'preconnect', href: 'https://res.cloudinary.com' },
  ]
}

type LoaderData = {
  navLinks: Graphcms_NavigationLink[]
}

export const loader: LoaderFunction = async () => {
  const navigationData: GetNavigationQuery = await graphQlClient.request(
    GetNavigation,
  )

  return {
    navLinks: navigationData?.graphcms?.navigationLinks,
  }
}

export const App = () => {
  const { navLinks }: LoaderData = useLoaderData()
  return (
    <html lang='en' className='h-full'>
      <head>
        <Meta />
        <Links />
      </head>

      <body className='h-full'>
        <div className='drawer min-h-screen w-full'>
          <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
          <div className='drawer-content flex flex-col'>
            <div className='container mx-auto flex min-h-screen flex-col p-4'>
              <Nav navLinks={navLinks} />
              <div className='prose max-w-none flex-1 p-2'>
                <Outlet />
              </div>
              <Footer />
            </div>
          </div>
          <MobileDrawer navLinks={navLinks} />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
