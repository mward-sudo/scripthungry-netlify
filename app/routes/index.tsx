import type { HeadersFunction } from '@remix-run/server-runtime'
import { Hero } from '../components/home/hero'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000',
  Link: '<https://res.cloudinary.com>; rel=preconnect',
})

export default function Index() {
  return (
    <>
      <Hero />
    </>
  )
}
