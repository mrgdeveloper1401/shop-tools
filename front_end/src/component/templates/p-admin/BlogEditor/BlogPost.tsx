import { FC, useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import { RichTextEditor, Link } from '@mantine/tiptap';

import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import '@mantine/tiptap/styles.css';

interface IBlogEditorProps {
  setFieldValue: (field: string, value: string) => void;
  value?: string;
}

const BlogEditor: FC<IBlogEditorProps> = ({ setFieldValue, value }) => {
  const [initialized, setInitialized] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      setFieldValue('post_body', editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value && !initialized) {
      editor.commands.setContent(value);
      setInitialized(true);
    }
  }, [editor, value, initialized]);

  if (!editor) return null;

  return (
    <RichTextEditor my="42" editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Enter image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="text-[12px] bg-slate-100 p-1 pt-2 rounded-[8px]"
            title="Insert Image"
          >
            Image
          </button>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default BlogEditor;
