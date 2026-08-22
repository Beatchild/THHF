
import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pullQuote: {
      togglePullQuote: () => ReturnType,
    }
  }
}



export const PullQuote = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'blockquote[data-type="pull-quote"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(HTMLAttributes, { 'data-type': 'pull-quote', class: 'pull-quote' }), 0]
  },

  addCommands() {
    return {
      togglePullQuote: () => ({ commands }: any) => {
        return commands.toggleNode(this.name, 'paragraph')
      },
    }
  },
})
