const fs = require('fs');

let content = fs.readFileSync('src/components/admin/TiptapEditor.tsx', 'utf8');

// Remove BubbleMenu import
content = content.replace('import { useEditor, EditorContent, BubbleMenu } from \'@tiptap/react\'', 'import { useEditor, EditorContent } from \'@tiptap/react\'');

// Replace BubbleMenu JSX with standard inline conditionally rendered JSX
const bubbleMenuRegex = /\{\/\* Bubble Menu for Images \*\/\}.*?<\/BubbleMenu>\s*\)}/s;

const newImageToolbar = `
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
`;

content = content.replace(bubbleMenuRegex, newImageToolbar);

fs.writeFileSync('src/components/admin/TiptapEditor.tsx', content, 'utf8');
