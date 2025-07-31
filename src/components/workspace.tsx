"use client"

import { useState, useEffect } from 'react';
import { ChatInterface } from './chat-interface';
import { ImageWorkspaceViewer } from './image-workspace-viewer';
import { PDFWorkspace } from './pdf-workspace'; 
import { FileUploadWorkspace } from './file-upload-workspace';

interface WorkspaceProps {
  initialFiles?: File[];
  initialText?: string;
}

export function Workspace({ initialFiles, initialText = '' }: WorkspaceProps) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const [questionText, setQuestionText] = useState(initialText);
  const [selectedFile, setSelectedFile] = useState<File[]>(files[0] ? [files[0]] : []);
  const [showFileUpload, setShowFileUpload] = useState(!!files.length);

  const isImageFile = (file: File) => { 
    return file.type.startsWith('image/'); 
  };
  const isPDFFile = (file: File) => { 
    return file.type === 'application/pdf'; 
  };


  const handleAddNewFiles = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (fileList) {
        const newFiles = Array.from(fileList);
        setFiles(prev => [...prev, ...newFiles]);
      }
    };
    input.click();
  };

  const handleGetAnswer = (selectedFiles: File[], text?: string) => {
    if(isPDFFile(files[0])) {
      // For PDFs, append the new selection to existing ones
      setSelectedFile(prev => [...prev, ...selectedFiles]);
    } else {
      // For images, update both the files array and selected files
      setFiles(selectedFiles);
      setSelectedFile(selectedFiles); // Set all selected files, not just the first one
    }
    if (text) {
      setQuestionText(text);
    }
    setShowFileUpload(false);
  };

  if (showFileUpload) {
    return <FileUploadWorkspace initialFiles={files} onGetAnswer={handleGetAnswer} />;
  }



    // Determine the type of viewer to show based on the first file
  const getWorkspaceComponent = () => {
    if (!files.length) return null;

    const firstFile = files[0];
    if (isImageFile(firstFile)) {
      return <ImageWorkspaceViewer files={files} />;
    } else if (isPDFFile(firstFile)) {
      return <PDFWorkspace 
        files={files} 
        onGetAnswer={handleGetAnswer}
        showChat={true}
        initialText={questionText}
      />;
    }
    return null;
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex">
        {/* File viewer in the middle */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Files</h2>
              <span className="text-sm text-gray-500">{files.length} files</span>
            </div>
            <button 
              onClick={handleAddNewFiles}
              className="px-4 py-1.5 text-sm bg-white border rounded-full hover:bg-gray-50"
            >
              Add new
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            {getWorkspaceComponent()}
          </div>

        </div>

        {/* Right panel - chat */}
        <div className="w-[400px] border-l flex flex-col overflow-hidden bg-white">
          <ChatInterface
            initialText={questionText}
            initialFiles={selectedFile}
          />
        </div>
      </div>
    </div>
  );
}
