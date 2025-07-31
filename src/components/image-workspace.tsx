"use client"

import { useState } from 'react';
import { ImageCropper } from './image-cropper';

interface ImageWorkspaceProps {
  files: File[];
  onGetAnswer: (files: File[], text?: string) => void;
}

export function ImageWorkspace({ files: initialFiles, onGetAnswer }: ImageWorkspaceProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(files[0] || null);
  const [isCropping, setIsCropping] = useState(false);

  const handleAddNewFiles = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (fileList) {
        const newFiles = Array.from(fileList);
        setFiles(prev => [...prev, ...newFiles]);
      }
    };
    input.click();
  };
  
  const handleGetAnswer = () => {
    if (files.length > 0) {
      // Make sure we pass all selected files and set appropriate text
      onGetAnswer(files, "Here are the images I'd like help with");
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo crop operation
  };

  const handleRedo = () => {
    // TODO: Implement redo crop operation
  };

  const handleCrop = () => {
    // TODO: Apply crop
  };

  if (!selectedFile) return null;

  const handleDeleteFile = (fileToDelete: File) => {
    if (files.length <= 1) return;
    const newFiles = files.filter(f => f !== fileToDelete);
    setFiles(newFiles);
    if (selectedFile === fileToDelete) {
      setSelectedFile(newFiles[0]);
    }
  };

  return (
    <div className="w-[60%] flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Crop the complete question</h1>
        </div>
        <button
          onClick={() => setIsCropping(false)}
          className="text-2xl font-light hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Image Viewer with Highlight Frame */}
        <div className="h-[80%] relative overflow-hidden flex flex-col items-center ">
          <div className="w-[200px] mb-[24px] bg-white rounded-lg shadow-lg p-2 flex gap-2 z-10">
            <button 
              onClick={handleUndo} 
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full"
              title="Undo"
            >
              ↺
            </button>
            <div className="w-px bg-gray-200"></div>
            <button
              onClick={handleCrop}
              className="px-4 font-medium"
            >
              Crop
            </button>
            <div className="w-px bg-gray-200"></div>
            <button 
              onClick={handleRedo}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full"
              title="Redo"
            >
              ↻
            </button>
          </div>
          <div className="relative inline-block max-h-[60vh]">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Question"
              className="h-full object-contain"
            />
            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
              {/* Corner circles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

      {/* Footer */}
      <div>
        {/* Thumbnails */}
        <div className="h-28  flex items-center gap-2 px-4 overflow-x-auto bg-white">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <button
                className={`h-20 w-20 flex-shrink-0 rounded-lg border-2 overflow-hidden ${
                  selectedFile === file ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </button>
              {files.length > 1 && (
                <button
                  onClick={() => handleDeleteFile(file)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddNewFiles}
            className="h-20 w-20 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center"
          >
            <span className="text-3xl text-gray-400">+</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="h-16 flex items-center justify-end gap-4 px-6">
          <button
            className="px-4 py-2 text-black hover:text-gray-600 font-medium border border-gray-300 rounded-full"
          >
            Thêm vào ô nhập câu hỏi thủ công
          </button>
          <button
            onClick={handleGetAnswer}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 font-medium"
          >
            Giải bài ngay
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
