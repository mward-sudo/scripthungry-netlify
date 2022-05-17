import { Hero } from './../components/home/hero'

export const headers = () => ({
  Link: '<https://res.cloudinary.com>; rel=preconnect',
})

export default function Index() {
  return (
    <>
      <Hero />
    </>
  )
}
