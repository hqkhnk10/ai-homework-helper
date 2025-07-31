"use client"

import { useState } from 'react';

interface ImageViewerProps {
  files: File[];
}

export function ImageViewer({ files: initialFiles }: ImageViewerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFiles[0] || null);

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        {selectedFile && (
          <div className="h-full flex items-center justify-center">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
              className="max-w-[90%] max-h-[90%] object-contain"
            />
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="h-24 border-t flex items-center gap-2 px-4 overflow-x-auto">
        {initialFiles.map((file, index) => (
          <button
            key={index}
            className={`h-16 w-16 flex-shrink-0 rounded-lg border-2 overflow-hidden ${
              selectedFile === file ? 'border-purple-500' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedFile(file)}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
