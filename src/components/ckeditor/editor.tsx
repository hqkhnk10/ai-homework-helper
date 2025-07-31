"use client"

// src/components/CKEditorComponent.tsx
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, List, ListProperties, Table, TableToolbar, Image, ImageUpload } from 'ckeditor5';
import MathType from '@wiris/mathtype-ckeditor5/dist/index.js';
import 'ckeditor5/ckeditor5.css';

interface CKEditorComponentProps {
  initialData?: string; // Optional: to set initial content
  onChange: (data: string) => void; // Callback function to pass data to parent
}
// This component is a wrapper for the CKEditor with specific configurations
export default function CKEditorComponent({ initialData = '', onChange }: CKEditorComponentProps) {
        const [editorData, setEditorData] = useState('');
    
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                licenseKey: 'GPL',
                plugins: [Essentials, Paragraph, Bold, Italic, MathType, List, ListProperties, Table, TableToolbar, Image, ImageUpload],
                toolbar: {
                    items: [
                        'numberedList',
                        'bulletedList',
                        '|',
                        'insertTable',
                        'imageUpload',
                        'MathType',
                        '|',
                        'undo',
                        'redo'
                    ],
                    shouldNotGroupWhenFull: true
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                placeholder: 'Type your question here...',
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
}