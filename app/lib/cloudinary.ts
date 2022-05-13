import {
    decode as base64Decode,
    encode as base64Encode,
  } from 'https://deno.land/std@0.82.0/encoding/base64.ts'

import { Cloudinary } from '@cloudinary/url-gen'
import { Effect } from '@cloudinary/url-gen/actions/effect'
import { fill } from '@cloudinary/url-gen/actions/resize'

export const getCloudinaryClient = new Cloudinary({
  cloud: { cloudName: 'scripthungry-com-prog' },
})

export type CloudinaryImageProps = {
  src: string
  srcSet: string
  sizes: string
  alt: string
  width: number
  height: number
  style: {
    backgroundImage: string
    backgroundSize: string
    aspectRatio: string
  }
}

interface GetCloudinaryImageProps {
  (props: {
    imgName: string
    alt: string
    width: number
    height: number
  }): Promise<CloudinaryImageProps>
}

export const getCloudinaryImageProps: GetCloudinaryImageProps = async ({
  imgName,
  alt,
  width,
  height,
}) => {
  const widths = [768, 1024, 1280, 1536]
  const sizes = [
    '(max-width: 640px) 768px',
    '(max-width: 768px) 1024px',
    '(max-width: 1024px) 1280px',
    '(max-width: 1280px) 1536px',
    '1536px',
  ]
  const averageWidth = Math.ceil(widths.reduce((a, s) => a + s) / widths.length)
  const heightToWidthRatio = height / width
  const blurredImage = await getImgBlur(imgName, heightToWidthRatio)
  return {
    src: getImageUrl(imgName, width, height),
    srcSet: getSrcSet(imgName, heightToWidthRatio, widths),
    sizes: sizes.join(', '),
    alt,
    style: {
      backgroundImage: `url("${blurredImage}")`,
      backgroundSize: 'cover',
      aspectRatio: `${width}/${height}`,
    },
    width,
    height,
  }
}

const getSrcSet = (
  imgName: string,
  heightToWidthRatio: number,
  widths: number[],
) =>
  widths
    .map((srcSetWidth) =>
      [
        getImageUrl(
          imgName,
          srcSetWidth,
          Math.ceil(srcSetWidth * heightToWidthRatio),
        ),
        `${srcSetWidth}w`,
      ].join(' '),
    )
    .join(', ')

const getImageUrl = (
  imgName: string,
  width: number,
  height: number,
  blur = 0,
) => {
  const cloudinary = getCloudinaryClient
  const blurEffect = blur === 0 ? Effect.noise(0) : Effect.blur(blur)

  return (
    cloudinary
      .image(imgName)
      .format('auto')
      .resize(fill(width, height))
      .effect(blurEffect)
      .toURL()
      // Remove the params from the url
      .replace(/\?.*/, '')
  )
}

const getImgBlur = async (
  imgName: string,
  heighToWidthRatio: number,
): Promise<string> => {
  const url = getImageUrl(imgName, 40, Math.ceil(40 * heighToWidthRatio), 200)
  // Using node typescript, Fetch image from url const and return the image response as a base64 encoded string.
  const imageUrlData = await fetch(url)
  const buffer = await imageUrlData.arrayBuffer()
  const stringifiedBuffer = base64Encode(buffer)
  const contentType = imageUrlData.headers.get('content-type')
  return `data:${contentType};base64,${stringifiedBuffer}`
}
