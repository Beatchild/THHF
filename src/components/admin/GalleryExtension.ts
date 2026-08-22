import { Node, mergeAttributes } from '@tiptap/core'

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: (options: { images: string[] }) => ReturnType
    }
  }
}

export const Gallery = Node.create<GalleryOptions>({
  name: 'gallery',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const imgs = element.getAttribute('data-images')
          return imgs ? imgs.split(',') : []
        },
        renderHTML: attributes => {
          return {
            'data-images': attributes.images.join(','),
          }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="gallery"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const images = HTMLAttributes['data-images'] ? HTMLAttributes['data-images'].split(',') : []
    
    // Fallback UI in tiptap editor
    const imgElements = images.map((src: string) => ['img', { src, class: 'w-24 h-24 object-cover rounded-md' }])
    
    return [
      'div', 
      mergeAttributes(HTMLAttributes, { 'data-type': 'gallery', class: 'gallery-wrapper flex gap-2 overflow-x-auto p-4 bg-zinc-800 rounded-lg my-4' }),
      ...imgElements
    ]
  },

  addCommands() {
    return {
      setGallery: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
