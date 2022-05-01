import type { HeadersFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
})

const Blog = () => {
  return <Outlet />
}

export default Blog
