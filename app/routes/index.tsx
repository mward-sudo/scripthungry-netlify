import type { HeadersFunction } from '@remix-run/server-runtime'
import { Hero } from '../components/home/hero'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
  Link: '<https://res.cloudinary.com>; rel=preconnect',
})

export default function Index() {
  return (
    <>
      <Hero />
    </>
  )
}
