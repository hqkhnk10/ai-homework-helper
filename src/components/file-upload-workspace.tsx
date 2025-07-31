"use client"

import { useState } from 'react';
import { ImageWorkspace } from './image-workspace';
import { PDFWorkspace } from './pdf-workspace';

interface FileUploadWorkspaceProps {
  initialFiles?: File[];
  onGetAnswer: (files: File[], text?: string) => void;
}

export function FileUploadWorkspace({ initialFiles, onGetAnswer }: FileUploadWorkspaceProps) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const [isDragging, setIsDragging] = useState(false);

  const isImageFile = (file: File) => file.type.startsWith('image/');
  const isPDFFile = (file: File) => file.type === 'application/pdf';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      handleFilesAdded(newFiles);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      handleFilesAdded(newFiles);
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


  
  const getWorkspace = () => {
    if (files.length > 0) {
      const firstFile = files[0];
      if (isImageFile(firstFile)) {
        return <ImageWorkspace files={files} onGetAnswer={onGetAnswer} />;
        } else if (isPDFFile(firstFile)) {
        return <PDFWorkspace files={files} onGetAnswer={onGetAnswer} />;
        }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {getWorkspace()}
    </div>
  );
}
