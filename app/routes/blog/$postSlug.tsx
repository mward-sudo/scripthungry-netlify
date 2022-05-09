import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { Content } from '~/components/blog/content'
import { CloudinaryImage } from '~/components/cloudinary-image'
import { FullWidthEscape } from '~/components/full-width-escape'
import { site } from '~/config'
import type { PostBySlugQuery } from '~/generated/graphql.server'
import { getPostData, getPostImageProps } from '~/lib/blog.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'

import { AuthorDetails } from './../../components/blog/author-details'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
})

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `${data.postData.graphcms?.post?.title} | ${site.name} Blog`,
  description: data.postData.graphcms?.post?.excerpt,
})

type LoaderData = {
  postData: PostBySlugQuery
  postImageProps: CloudinaryImageProps | null
}

export const loader: LoaderFunction = async ({ params }) => {
  // Get post slug from loader params, and verify it is not empty
  const { postSlug } = params
  if (!postSlug) {
    throw new Response('No post slug', { status: 404 })
  }

  const postData = await getPostData({ postSlug })
  const postImageProps = await getPostImageProps({ postData })

  const data: LoaderData = { postData, postImageProps }
  return json(data)
}

const PostSlugRoute = () => {
  const { postData, postImageProps } = useLoaderData<LoaderData>()
  invariant(postData?.graphcms?.post, 'No post data')
  const post = postData.graphcms.post

  return (
    <div className='mx-auto max-w-3xl'>
      {post.author && <AuthorDetails author={post.author} date={post.date} />}
      <h1 className='mt-8 text-center'>{post?.title}</h1>
      {postImageProps && (
        <FullWidthEscape>
          <div className='container mx-auto'>
            <CloudinaryImage
              imgProps={postImageProps}
              className='drop-shadow-2xl'
            />
          </div>
        </FullWidthEscape>
      )}
      <Content content={post.content} />
    </div>
  )
}

export default PostSlugRoute
