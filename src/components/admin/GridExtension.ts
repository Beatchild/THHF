import { Node, mergeAttributes } from '@tiptap/core'

export const GridGallery = Node.create({
  name: 'gridGallery',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const raw = element.getAttribute('data-images');
          try { return raw ? JSON.parse(raw) : []; } catch(e) { return []; }
        },
        renderHTML: attributes => {
          return { 'data-images': JSON.stringify(attributes.images) }
        }
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="grid-gallery"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const images = HTMLAttributes.images || [];
    
    // We render a simple visual representation in the editor
    const imgTags = images.map((src: string) => 
      ['img', { src, style: 'width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 1/1;' }]
    );
    
    return [
      'div', 
      mergeAttributes(HTMLAttributes, { 'data-type': 'grid-gallery', style: 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;' }),
      ...imgTags.map((img: any) => ['div', {}, img])
    ]
  },
})
