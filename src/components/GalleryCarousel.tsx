'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GalleryCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!images || images.length === 0) return null

  return (
    <div className="relative group my-8">
      <div className="overflow-hidden rounded-xl border border-white/10" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <img src={src} className="w-full h-[500px] object-cover" alt={`Gallery image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      
      {images.length > 1 && (
        <>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-lime-500 hover:text-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" onClick={scrollPrev}>
            <ChevronLeft />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-lime-500 hover:text-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" onClick={scrollNext}>
            <ChevronRight />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
            Swipe for more
          </div>
        </>
      )}
    </div>
  )
}
