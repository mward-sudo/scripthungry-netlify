import { site } from '~/config'
import { sdk } from '~/lib/graphql.server'

const getBlogPosts = async (): Promise<string[]> => {
  const postSlugs = await sdk.PostSlugs()
  return (
    postSlugs.graphcms?.posts.map((post) => {
      return `
    <url>
      <loc>${site.url}/blog/${post.slug}</loc>
      <lastmod>${post.updatedAt}</lastmod>
    </url>`
    }) ?? []
  )
}

export const loader = async () => {
  const blogPosts = await getBlogPosts()

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${site.url}/</loc>
      </url>
      <url>
        <loc>${site.url}/github</loc>
      </url>
      ${blogPosts.join('\n')}
    </urlset>
  `

  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  })
}
