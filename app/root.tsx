import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import type { CatchBoundaryComponent } from '@remix-run/react/routeModules'
import { AnimatePresence, motion } from 'framer-motion'

import { Footer } from './components/footer'
import { MobileDrawer } from './components/navigation/mobile-drawer'
import { Nav } from './components/navigation/nav'
import { site } from './config'
import type { Graphcms_NavigationLink } from './generated/graphql.server'
import { fadeInUp } from './lib/animations'
import { sdk } from './lib/graphql.server'
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
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
  ]
}

type LoaderData = {
  navLinks: Graphcms_NavigationLink[]
}

export const loader: LoaderFunction = async () => {
  const navigationData = await sdk.GetNavigation().catch(() => {
    throw new Response('Failed to fetch navigation data', { status: 500 })
  })

  return {
    navLinks: navigationData?.graphcms?.navigationLinks,
  }
}

const Document = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <Scripts />
      <ScrollRestoration />
      <LiveReload />
    </body>
  </html>
)

export const App = () => {
  const { navLinks }: LoaderData = useLoaderData()

  return (
    <Document>
      <div className='drawer w-full'>
        <input id='mobile-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content flex flex-col'>
          <div className='container mx-auto flex h-full min-h-screen flex-col p-4'>
            <Nav navLinks={navLinks} />
            <div className='prose max-w-none flex-1 p-2'>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  variants={fadeInUp}
                  initial='initial'
                  animate='animate'
                  key={useLocation().key}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
            <Footer />
          </div>
        </div>
        <MobileDrawer navLinks={navLinks} />
      </div>
    </Document>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <Document>
      <div className='container prose mx-auto flex min-h-screen flex-col justify-center text-center'>
        <div>
          <h1 className='m-0'>Something unexpected happened</h1>
          <div className='alert alert-error mt-8 justify-center text-2xl shadow-lg'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 flex-shrink-0 stroke-current'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='m-4 my-0'>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    </Document>
  )
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch()
  return (
    <Document>
      <div className='container prose mx-auto mt-16 flex min-h-screen flex-col text-center'>
        <div>
          <h1 className='m-0'>Something isn't quite right</h1>
          <div className='alert alert-error mt-8 justify-center text-2xl shadow-lg'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 flex-shrink-0 stroke-current'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='m-4 my-0'>{caught.data}</p>
            </div>
          </div>
        </div>
      </div>
    </Document>
  )
}

export default App
