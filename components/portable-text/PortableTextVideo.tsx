
import { type PortableTextComponentProps } from '@portabletext/react'

type VideoValue = {
  url?: string
  mimeType?: string
  originalFilename?: string
  caption?: string
}

export function PortableTextVideo({
  value,
}: PortableTextComponentProps<VideoValue>) {
  if (!value.url) {
    return null
  }

  return (
    <figure className="my-8 w-full">
      <video
        controls
        playsInline
        preload="metadata"
        className="h-auto w-full rounded-xl"
        style={{ aspectRatio: '16 / 9' }}
      >
        <source src={value.url} type={value.mimeType || undefined} />
        您的浏览器不支持 HTML5 视频播放。
      </video>

      {value.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}
