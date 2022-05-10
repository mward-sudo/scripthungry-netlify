import type { CloudinaryImageProps } from '~/lib/cloudinary'

export const CloudinaryImage = ({
  imgProps,
  className,
  fixed = false,
}: {
  imgProps: CloudinaryImageProps | undefined
  className?: string
  fixed?: boolean
}) => {
  if (!imgProps) {
    return null
  }

  return fixed ? (
    <div style={imgProps.style}>
      <img
        src={imgProps.src}
        alt={imgProps.alt}
        width={imgProps.width}
        height={imgProps.height}
        className={`${className}`}
      />
    </div>
  ) : (
    <div style={imgProps.style}>
      <img
        src={imgProps.src}
        alt={imgProps.alt}
        srcSet={imgProps.srcSet}
        sizes={imgProps.sizes}
        style={{ aspectRatio: imgProps.style.aspectRatio }}
        className={`${className} width-full`}
      />
    </div>
  )
}
