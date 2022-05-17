import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import type { CatchBoundaryComponent } from '@remix-run/react/routeModules'

import { CategoriesCloud } from '~/components/blog/categories-cloud'
import type { PaginationDetails } from '~/components/blog/pagination'
import { Pagination } from '~/components/blog/pagination'
import type {
  CategoriesQuery,
  PostsExcerptsQuery,
} from '~/generated/graphql.server'
import {
  getBlogImagesData,
  getCategoriesData,
  getCategoryData,
  getPageTitle,
  getPostExcerptData,
  getTotalPages,
} from '~/lib/blog.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'

import { BlogExcerpt } from './../../components/blog/blog-excerpt'

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined
}) => ({
  title: data?.title,
})

export type LoaderData = {
  blogImages: (CloudinaryImageProps | undefined)[]
  categories: CategoriesQuery
  categoryName: string | undefined
  pagination: PaginationDetails
  postExcerpts: PostsExcerptsQuery
  title: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  // Get the page number from the request, if null then default to 1
  const pageNo = Number(url.searchParams.get('page') ?? '1')
  // Get tye category slug from the request, or null if none
  const categorySlug = url.searchParams.get('category') ?? ''
  // Get the category from the slug, if any, the posts and the categories, for the category cloud
  const [categoryData, postExcerpts, categories] = await Promise.all([
    getCategoryData(categorySlug),
    getPostExcerptData(pageNo, categorySlug),
    getCategoriesData(),
  ])
  const categoryName = categoryData?.graphcms?.blogCategory?.name ?? ''
  // Get the cloudinary image props for the post excerpts, the total number of pages, for pagination purposes and the page title
  const [blogImages, totalPages, title] = [
    await getBlogImagesData(postExcerpts),
    getTotalPages(postExcerpts),
    getPageTitle({ categoryName, pageNo }),
  ]

  const data: LoaderData = {
    blogImages,
    categories,
    categoryName,
    pagination: {
      currentUrl: request.url,
      pageNo,
      totalPages,
    },
    postExcerpts,
    title,
  }

  return json(data)
}

const BlogIndex = () => {
  const { blogImages, categories, categoryName, pagination, postExcerpts } =
    useLoaderData<LoaderData>()

  return (
    <>
      <div className='flex flex-col-reverse gap-8 lg:flex-row'>
        <div>
          <h1 className={categoryName ? '' : 'sr-only'}>
            {categoryName ? `${categoryName} Category Posts` : 'Blog'}
          </h1>
          <BlogExcerpt posts={postExcerpts} blogImages={blogImages} />
          <Pagination pagination={pagination} />
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
