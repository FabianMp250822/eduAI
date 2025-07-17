
'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMceEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
}

export function TinyMceEditor({ value, onEditorChange }: TinyMceEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      tinymceScriptSrc={`https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}/tinymce/7/tinymce.min.js`}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(newValue, editor) => onEditorChange(newValue)}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'paste'
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        paste_data_images: true, // Allows pasting images
        paste_as_text: false,
        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,-table,-tr,-td,-tbody,-thead,-tfoot,-div,-br',
        paste_merge_formats: true,
        paste_webkit_styles: 'all',
      }}
    />
  );
}
