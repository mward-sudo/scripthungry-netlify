import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { CloudinaryImage } from '~/components/cloudinary-image'
import { FullWidthEscape } from '~/components/full-width-escape'
import { site } from '~/config'
import type { PostBySlugQuery } from '~/generated/graphql.server'
import { PostBySlug } from '~/generated/graphql.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'
import { getCloudinaryImageProps } from '~/lib/cloudinary'
import { graphQlClient } from '~/lib/graphql.server'

import { AuthorDetails } from './../../components/blog/author-details'

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

  // Query GraphQL server for post data, using the post slug
  const postData = await graphQlClient.request<PostBySlugQuery>(PostBySlug, {
    slug: postSlug,
  })
  // Verify post data was found
  if (!postData?.graphcms?.post) {
    throw new Response('No post found', { status: 404 })
  }

  const coverImage = postData.graphcms.post.coverImage
  const postImageProps = coverImage
    ? await getCloudinaryImageProps({
        imgName: `graphcms/${coverImage?.handle}`,
        alt: postData.graphcms.post.title,
        width: coverImage?.width || 16,
        height: coverImage?.height || 9,
      })
    : null

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
      <div dangerouslySetInnerHTML={{ __html: post?.content.html }} />
    </div>
  )
}

export default PostSlugRoute
