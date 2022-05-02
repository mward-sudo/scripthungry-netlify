import { Hero } from './../components/home/hero'

export const headers = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
})

export default function Index() {
  return (
    <>
      <Hero />
    </>
  )
}
