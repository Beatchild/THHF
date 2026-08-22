'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { Iframe } from './IframeExtension'
import { PullQuote } from './PullQuoteExtension'
import { Gallery } from './GalleryExtension'
import { uploadImage } from '@/lib/firebase-client'
import { useCallback } from 'react'
import { Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, List, Quote, ImageIcon, Strikethrough, Code, Link as LinkIcon, Video as YoutubeIcon, Music, Highlighter, Images, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Undo, Redo, Eraser, Maximize, Minimize } from 'lucide-react'

const AdvancedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        renderHTML: attributes => {
          if (!attributes.align) return {}
          return {
            'data-align': attributes.align,
            class: `image-align-${attributes.align}`
          }
        },
        parseHTML: element => element.getAttribute('data-align') || 'center',
      }
    }
  }
})

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (c: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Write your masterpiece here... Use the toolbar above to style your content.',
        emptyEditorClass: 'is-editor-empty',
      }),
      AdvancedImage,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-lime-400 hover:underline cursor-pointer decoration-lime-500/30 decoration-2 underline-offset-4' } }),
      Youtube.configure({ inline: false, HTMLAttributes: { class: 'w-full aspect-video rounded-2xl shadow-2xl my-12 border border-white/10' } }),
      Iframe,
      PullQuote,
      Gallery,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-editor min-h-[70vh] outline-none text-white text-xl leading-loose font-medium max-w-4xl mx-auto py-16 px-4 md:px-12',
      },
    },
  })

  const addImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        try {
          const url = await uploadImage(file)
          editor?.chain().focus().setImage({ src: url }).updateAttributes('image', { align: 'center' }).run()
        } catch (e: any) {
          alert('Upload failed: ' + e.message)
        }
      }
    }
    input.click()
  }, [editor])
  
  const addGallery = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async () => {
      if (input.files?.length) {
        try {
          const urls = []
          for (let i = 0; i < input.files.length; i++) {
            const url = await uploadImage(input.files[i])
            urls.push(url)
          }
          editor?.chain().focus().setGallery({ images: urls }).run()
        } catch (e: any) {
          alert('Gallery upload failed: ' + e.message)
        }
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addYoutube = useCallback(() => {
    const url = prompt('Enter YouTube URL')
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }, [editor])

  const addIframe = useCallback(() => {
    const url = prompt('Enter SoundCloud, Spotify, or any Embed Iframe URL')
    if (url) {
      editor?.chain().focus().setIframe({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const MenuButton = ({ onClick, active, children, title }: { onClick: () => void, active?: boolean, children: React.ReactNode, title?: string }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${active ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20 scale-105' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="relative border-2 border-zinc-800 rounded-2xl overflow-hidden bg-[#0d0d0d] focus-within:border-lime-500/50 focus-within:shadow-[0_0_40px_rgba(163,224,29,0.1)] transition-all duration-500 group">
      
      
      {/* Image Specific Toolbar */}
      {editor?.isActive('image') && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-lime-500/10 backdrop-blur-xl border border-lime-500/30 p-1.5 rounded-xl shadow-2xl animate-in slide-in-from-top-4">
          <MenuButton title="Float Left (Wrap Text)" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()} active={editor.isActive('image', { align: 'left' })}>
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton title="Center (Default)" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()} active={editor.isActive('image', { align: 'center' })}>
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton title="Float Right (Wrap Text)" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()} active={editor.isActive('image', { align: 'right' })}>
            <AlignRight size={16} />
          </MenuButton>
          <div className="w-px h-5 bg-lime-500/30 mx-1"></div>
          <MenuButton title="Full Width" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'full' }).run()} active={editor.isActive('image', { align: 'full' })}>
            <Maximize size={16} />
          </MenuButton>
          <MenuButton title="Small Size" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'small' }).run()} active={editor.isActive('image', { align: 'small' })}>
            <Minimize size={16} />
          </MenuButton>
        </div>
      )}


      {/* Sticky Modern Toolbar */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1.5 p-3 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 shadow-xl">
        
        {/* History */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
          <MenuButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <Undo size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <Redo size={18} strokeWidth={2.5} />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1"></div>

        {/* Inline Formatting */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
          <MenuButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <Bold size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <Italic size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
            <UnderlineIcon size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
            <Strikethrough size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Link" onClick={setLink} active={editor.isActive('link')}>
            <LinkIcon size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            <Eraser size={18} strokeWidth={2.5} />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1 hidden sm:block"></div>
        
        {/* Headings */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
          <MenuButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
            <Heading2 size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
            <Heading3 size={18} strokeWidth={2.5} />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1 hidden lg:block"></div>
        
        {/* Alignment */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800 hidden md:flex">
          <MenuButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
            <AlignLeft size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
            <AlignCenter size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
            <AlignRight size={18} strokeWidth={2.5} />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1 hidden xl:block"></div>
        
        {/* Blocks */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
          <MenuButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            <List size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
            <Quote size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Pull Quote (Huge Text)" onClick={() => editor.chain().focus().togglePullQuote().run()} active={editor.isActive('pullQuote')}>
            <Highlighter size={18} strokeWidth={2.5} className={editor.isActive('pullQuote') ? "text-black" : "text-lime-400"} />
          </MenuButton>
          <MenuButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
            <Code size={18} strokeWidth={2.5} />
          </MenuButton>
          <MenuButton title="Divider (Horizontal Rule)" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus size={18} strokeWidth={2.5} />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        
        {/* Media */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
          <MenuButton title="Upload Single Image" onClick={addImage}>
            <ImageIcon size={18} strokeWidth={2.5} className="text-blue-400" />
          </MenuButton>
          <MenuButton title="Upload Image Gallery" onClick={addGallery}>
            <Images size={18} strokeWidth={2.5} className="text-purple-400" />
          </MenuButton>
          <MenuButton title="YouTube Video" onClick={addYoutube}>
            <YoutubeIcon size={18} strokeWidth={2.5} className="text-red-500" />
          </MenuButton>
          <MenuButton title="SoundCloud / Spotify Embed" onClick={addIframe}>
            <Music size={18} strokeWidth={2.5} className="text-orange-400" />
          </MenuButton>
        </div>
      </div>
      
      {/* Editor Canvas */}
      <div className="bg-[#050505] relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
