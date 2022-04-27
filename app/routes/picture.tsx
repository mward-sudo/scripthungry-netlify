import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { CloudinaryImage } from '~/components/cloudinary-image'
import type { CloudinaryImageProps } from '~/lib/cloudinary'
import { getCloudinaryImageProps } from '~/lib/cloudinary'

export const headers = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
})

export const loader: LoaderFunction = async () => {
  const imageProps = await getCloudinaryImageProps({
    imgName: 'graphcms/bAXCdhK3QOqWPbxBgI1t',
    alt: 'A cloudinary image',
    width: 3,
    height: 2,
  })
  return {
    cloudinaryImage: imageProps,
  }
}

type LoaderData = {
  cloudinaryImage: CloudinaryImageProps
}

const Picture = () => {
  const data: LoaderData = useLoaderData()

  return (
    <div>
      <h1>Picture</h1>
      <CloudinaryImage imgProps={data.cloudinaryImage} />
    </div>
  )
}

export default Picture
