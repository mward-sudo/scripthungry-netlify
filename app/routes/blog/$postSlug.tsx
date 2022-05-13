
import { useLoaderData } from '@remix-run/react'
import type { HeadersFunction, LoaderFunction, MetaFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { motion } from 'framer-motion'
import invariant from 'tiny-invariant'

import { Content } from '~/components/blog/content'
import { CloudinaryImage } from '~/components/cloudinary-image'
import { FullWidthEscape } from '~/components/full-width-escape'
import { site } from '~/config'
import type { PostBySlugQuery } from '~/generated/graphql.server'
import { fadeInUp } from '~/lib/animations'
import {
  getPostAuthorImageProps,
  getPostData,
  getPostImageProps,
} from '~/lib/blog.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'

import { AuthorDetails } from '../../components/blog/author-details'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000',
})

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `${data.postData.graphcms?.post?.title} | ${site.name} Blog`,
  description: data.postData.graphcms?.post?.excerpt,
})

type LoaderData = {
  postData: PostBySlugQuery
  postImageProps: CloudinaryImageProps | null
  authorImageProps: CloudinaryImageProps | null
}

export const loader: LoaderFunction = async ({ params }) => {
  // Get post slug from loader params, and verify it is not empty
  const { postSlug } = params
  if (!postSlug) {
    throw new Response('No post slug', { status: 404 })
  }

  const postData = await getPostData({ postSlug })
  const postImageProps = await getPostImageProps({ postData })

  const authorImageProps = await getPostAuthorImageProps({
    postAuthor: postData?.graphcms?.post?.author,
  })

  const data: LoaderData = { postData, postImageProps, authorImageProps }
  return json(data)
}

const PostSlugRoute = () => {
  const { postData, postImageProps, authorImageProps } =
    useLoaderData<LoaderData>()
  invariant(postData?.graphcms?.post, 'No post data')
  const post = postData.graphcms.post

  return (
    <div className='mx-auto max-w-3xl'>
      {post.author && (
        <AuthorDetails
          author={post.author}
          date={post.date}
          authorImgProps={authorImageProps}
        />
      )}
      <motion.h1 variants={fadeInUp} className='mt-8 text-center'>
        {post?.title}
      </motion.h1>
      {postImageProps && (
        <FullWidthEscape>
          <motion.div variants={fadeInUp} className='container mx-auto'>
            <CloudinaryImage
              imgProps={postImageProps}
              className='drop-shadow-2xl'
            />
          </motion.div>
        </FullWidthEscape>
      )}
      <motion.div variants={fadeInUp}>
        <Content content={post.content} />
      </motion.div>
    </div>
  )
}

export default PostSlugRoute
