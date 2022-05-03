import { Hero } from './../components/home/hero'

export const headers = () => ({
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
