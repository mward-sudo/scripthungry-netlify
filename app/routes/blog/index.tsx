import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { Response } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import type { CatchBoundaryComponent } from '@remix-run/react/routeModules'

import { CategoriesCloud } from '~/components/blog/categories-cloud'
import { Pagination } from '~/components/blog/pagination'
import { blog, site } from '~/config'
import type {
  CategoriesQuery,
  PostsExcerptsQuery,
} from '~/generated/graphql.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'
import { getCloudinaryImageProps } from '~/lib/cloudinary'
import { sdk } from '~/lib/graphql.server'

import { BlogExcerpt } from './../../components/blog/blog-excerpt'

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined
}) => ({
  title: data ? getPageTitle(data) : '',
})

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
})

type LoaderData = {
  blogImages: (CloudinaryImageProps | undefined)[]
  categories: CategoriesQuery
  categoryName: string | undefined
  currentUrl: string
  postExcerpts: PostsExcerptsQuery
  pageNo: number
  totalPages: number
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  // Get the page number from the request, if null then default to 1
  const pageNo = Number(url.searchParams.get('page') ?? '1')
  // Get tye category slug from the request, or null if none
  const categorySlug = url.searchParams.get('category') ?? ''
  // Get the category from the slug, if any
  const categoryData = await getCategoryData(categorySlug)
  // Get the posts
  const postExcerptData = await getPostExcerptData(pageNo, categorySlug)
  // Get the categories, for the category cloud
  const categoriesData = await getCategoriesData()
  // Get the cloudinary image props for the post excerpts
  const blogImagesData = await getBlogImagesData(postExcerptData)
  // Get the total number of pages, for pagination purposes
  const totalPages = getTotalPages(postExcerptData)

  // Throw a response of 404 if no posts were found
  if (!postExcerptData.graphcms?.posts.length) {
    throw new Response('No posts found', { status: 404 })
  }

  const data: LoaderData = {
    blogImages: blogImagesData,
    categories: categoriesData,
    categoryName: categoryData?.graphcms?.blogCategory?.name,
    currentUrl: request.url,
    pageNo,
    postExcerpts: postExcerptData,
    totalPages,
  }

  return json(data)
}

const getBlogImagesData = async (postExcerptData: PostsExcerptsQuery) => {
  return postExcerptData?.graphcms?.posts
    ? await Promise.all<CloudinaryImageProps | undefined>(
        postExcerptData.graphcms.posts.map(async (post) => {
          if (post.coverImage) {
            return await getCloudinaryImageProps({
              alt: post.title || '',
              height: post.coverImage.height || 9,
              imgName: `graphcms/${post.coverImage.handle}`,
              width: post.coverImage.width || 16,
            })
          }
        }),
      )
    : []
}

const getCategoriesData = async () => {
  return await sdk.Categories().catch(() => {
    throw new Error('Error getting categories data')
  })
}

const getCategoryData = async (categorySlug: string) => {
  const category = categorySlug
    ? await sdk.Category({ category: categorySlug }).catch(() => {
        throw new Error('Error getting category info')
      })
    : null

  if (categorySlug !== '' && category?.graphcms?.blogCategory === null) {
    throw new Response(`The category '${categorySlug}' not found`, {
      status: 404,
    })
  }

  return category
}

const getPageTitle = ({ categoryName, pageNo }: LoaderData) => {
  const title: Record<number, string>[] = []
  if (categoryName) {
    title.push(categoryName)
  }
  if (pageNo > 1) {
    title.push(`Page ${pageNo}`)
  }
  title.push(`${site.name} - Blog`)

  return title.join(' | ')
}

const getPostExcerptData = async (
  pageNo: number,
  categorySlug: string | null,
) => {
  const posts = await sdk
    .PostsExcerpts({
      postsPerPage: blog.postsPerPage,
      skip: blog.postsPerPage * (pageNo - 1),
      category: categorySlug ?? '',
    })
    .catch(() => {
      throw new Error('Error getting posts')
    })

  if (posts.graphcms?.posts.length === 0) {
    throw new Response(`No posts in category '${categorySlug}'`, {
      status: 404,
    })
  }

  return posts
}

const getTotalPages = (postExcerptData: PostsExcerptsQuery) => {
  return postExcerptData?.graphcms
    ? postExcerptData.graphcms?.postsConnection.aggregate.count /
        blog.postsPerPage
    : 1
}

const BlogIndex = () => {
  const {
    blogImages,
    categories,
    categoryName,
    currentUrl,
    pageNo,
    postExcerpts,
    totalPages,
  } = useLoaderData<LoaderData>()

  return (
    <>
      <div className='flex flex-col-reverse gap-8 lg:flex-row'>
        <div>
          <h1 className={categoryName ? '' : 'sr-only'}>
            {categoryName ? `${categoryName} Category Posts` : 'Blog'}
          </h1>
          <BlogExcerpt posts={postExcerpts} blogImages={blogImages} />
          <Pagination
            pageNo={pageNo}
            totalPages={totalPages}
            currentUrl={currentUrl}
          />
        </div>
        <div className='min-w-fit pb-8 text-center lg:w-1/4 lg:pb-0'>
          <CategoriesCloud categories={categories} />
        </div>
      </div>
    </>
  )
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch()
  return (
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
  )
}

export default BlogIndex
