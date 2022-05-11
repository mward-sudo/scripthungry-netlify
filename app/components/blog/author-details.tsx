import { motion } from 'framer-motion'

import type { PostAuthorFragment } from '~/generated/graphql.server'
import { fadeInUp } from '~/lib/animations'
import type { CloudinaryImageProps } from '~/lib/cloudinary'

import { CloudinaryImage } from '../cloudinary-image'

type props = {
  author: PostAuthorFragment
  date: string
  authorImgProps: CloudinaryImageProps | null
}

export const AuthorDetails = ({ author, date, authorImgProps }: props) => {
  return (
    <motion.div
      variants={fadeInUp}
      className='flex items-center justify-center gap-4 text-lg'
    >
      {authorImgProps && (
        <div className='avatar'>
          <div className='w-12 rounded-xl'>
            <CloudinaryImage imgProps={authorImgProps} className='m-0' fixed />
          </div>
        </div>
      )}
      <div className='text-base-content/60'>
        Published {date} by <span className='font-bold'>{author.name}</span>
      </div>
    </motion.div>
  )
}
