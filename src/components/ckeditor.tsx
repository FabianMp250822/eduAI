
'use client';

import React, { useEffect, useState } from 'react';

// This component is configured to only run on the client side.
// CKEditor relies on browser APIs that are not available on the server.

interface RichTextEditorProps {
  value: string;
  onChange: (data: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditor, setCKEditor] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the CKEditor components
    const loadCKEditor = async () => {
      const { CKEditor: CKEditorComponent } = await import('@ckeditor/ckeditor5-react');
      const ClassicEditorBuild = await import('@ckeditor/ckeditor5-build-classic');
      
      setCKEditor(() => CKEditorComponent);
      setClassicEditor(() => ClassicEditorBuild);
      setEditorLoaded(true);
    };

    loadCKEditor();
  }, []);

  if (!editorLoaded || !CKEditor || !ClassicEditor) {
    return <div>Cargando editor...</div>;
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert min-h-[300px]">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
           toolbar: {
                items: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'bulletedList', 'numberedList', '|',
                    'outdent', 'indent', '|',
                    'link', 'blockQuote', 'insertTable', '|',
                    'undo', 'redo'
                ]
            },
            language: 'es',
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells'
                ]
            },
        }}
      />
    </div>
  );
}

    