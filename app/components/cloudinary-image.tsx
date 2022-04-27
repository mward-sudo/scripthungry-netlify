import type { CloudinaryImageProps } from '~/lib/cloudinary'

export const CloudinaryImage = ({
  imgProps,
}: {
  imgProps: CloudinaryImageProps
}) => {
  return (
    <div style={imgProps.style}>
      <img
        src={imgProps.src}
        alt={imgProps.alt}
        srcSet={imgProps.srcSet}
        sizes={imgProps.sizes}
        style={{ width: '100%', aspectRatio: imgProps.style.aspectRatio }}
      />
    </div>
  )
}
