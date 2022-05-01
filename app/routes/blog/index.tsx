import type { HeadersFunction, LoaderFunction } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { CategoriesCloud } from '~/components/blog/categories-cloud'
import { Pagination } from '~/components/blog/pagination'
import { blog } from '~/config'
import type {
  CategoriesQuery,
  CategoryQuery,
  PostsExcerptsQuery,
} from '~/generated/graphql.server'
import { Category } from '~/generated/graphql.server'
import { Categories } from '~/generated/graphql.server'
import { PostsExcerpts } from '~/generated/graphql.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'
import { getCloudinaryImageProps } from '~/lib/cloudinary'
import { graphQlClient } from '~/lib/graphql.server'

import { BlogExcerpt } from './../../components/blog/blog-excerpt'

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
  return await graphQlClient.request<CategoriesQuery>(Categories)
}

const getCategoryData = async (categorySlug: string | null) => {
  return categorySlug
    ? await graphQlClient.request<CategoryQuery>(Category, {
        category: categorySlug,
      })
    : null
}

const getPostExcerptData = async (
  pageNo: number,
  categorySlug: string | null,
) => {
  return await graphQlClient.request<PostsExcerptsQuery>(PostsExcerpts, {
    postsPerPage: blog.postsPerPage,
    skip: blog.postsPerPage * (pageNo - 1),
    category: categorySlug,
  })
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

export default BlogIndex
