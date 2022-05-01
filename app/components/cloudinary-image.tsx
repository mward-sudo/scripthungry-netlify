import type { CloudinaryImageProps } from '~/lib/cloudinary'

export const CloudinaryImage = ({
  imgProps,
  className,
}: {
  imgProps: CloudinaryImageProps | undefined
  className?: string
}) => {
  return imgProps ? (
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
  ) : null
}
