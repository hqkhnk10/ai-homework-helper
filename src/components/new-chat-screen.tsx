"use client"

import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, List, ListProperties ,Table ,TableToolbar ,Image,ImageUpload   } from 'ckeditor5';
import { MainLayout } from './layout/main-layout';
import { Workspace } from './workspace';
import MathType from '@wiris/mathtype-ckeditor5/dist/index.js';

import 'ckeditor5/ckeditor5.css';
import dynamic from 'next/dynamic';

// Dynamically import the PdfViewer component, disabling server-side rendering
const CKEditorComponent = dynamic(() => import('./ckeditor/editor'), {
  ssr: false,
});

export function NewChatScreen() {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [showWorkspace, setShowWorkspace] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [editorContent, setEditorContent] = useState(''); // State to hold CKEditor content

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    // Callback function to receive data from CKEditorComponent
    const handleEditorChange = (data: string) => {
        setEditorContent(data); // Update the state with the new content
        console.log('Received editor content in parent:', data);
        // You can now do anything with 'data', e.g., send it to an API, save to local storage, etc.
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const simulateUpload = async () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate progress updates
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadProgress(i);
        }
        
        setIsUploading(false);
        setUploadProgress(0);
    };

    const handleFilesAdded = async (newFiles: File[]) => {
        await simulateUpload();
        setFiles(prev => [...prev, ...newFiles]);
        setShowWorkspace(true);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const newFiles = Array.from(e.dataTransfer.files);
        if (newFiles.length > 0) {
            await handleFilesAdded(newFiles);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            await handleFilesAdded(newFiles);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items);
        const newFiles = items
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .filter(Boolean) as File[];

        if (newFiles.length > 0) {
            handleFilesAdded(newFiles);
        }
    };

    return (
        <MainLayout>
            {showWorkspace ? (
                <Workspace initialFiles={files} initialText={editorContent} />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {/* Header */}
            <h1 
                className="text-4xl font-bold mb-4"
            >
                #1 Free AI Homework Helper
            </h1>
            <p className="text-[24px] mb-12">
                Study with our AI Homework Helper to get instant, step-by-step solutions to any problem.
            </p>

            {/* Upload Area */}
            <div
                className={`w-[80%] bg-[#F8F7FB] p-4 rounded-lg border-2 border-dotted transition-colors min-h-[200px] flex items-center justify-center ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } mb-8 relative hover:bg-gray-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center gap-2 cursor-pointer">
                    <div className="flex gap-2">
                            <img
                                src="/image 5.png"
                                alt="Upload Icon"
                            />
                    </div>
                      {isUploading ? (
                        <div className="w-full max-w-md mx-auto px-4">
                            <div className='w-full text-center mb-2'>
                                Uploading
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-600 text-center mt-2">Uploading... {uploadProgress}%</p>
                            <div className='flex justify-center'>
                                <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsUploading(false);
                                    setUploadProgress(0);
                                    setFiles([]);
                                }}
                                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Hủy tải lên
                            </button>
                            </div>
                            
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <p className="text-lg">Upload Image or PDF to solve questions in it</p>
                            <p className="text-sm text-gray-500">Command + V to paste</p>
                        </div>
                    )}

                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf"
                        multiple
                        id="file-upload"
                    />
                </label>
            </div>

            <div className='text-[24px] mt-[96px] mb-[16px]'>Nhập câu hỏi thủ công</div>

            {/* Rich Text Editor */}
            <div className="w-[80%] relative border-2 border-dotted border-gray-300">
                <div className="max-h-[500px] overflow-y-auto">
                    <CKEditorComponent onChange={handleEditorChange} />
                </div>

                <button
                    className="h-[36px] absolute bottom-2 right-4 bg-black text-white px-6 py-2 rounded-[16px] font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => {
                        setShowWorkspace(true);
                    }}
                >
                    Get answer
                </button>
            </div>
                </div>
            )}
        </MainLayout>
    );
}
