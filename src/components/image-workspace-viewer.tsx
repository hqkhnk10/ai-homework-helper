"use client"

import { useState } from 'react';

interface ImageWorkspaceViewerProps {
  files: File[];
}

export function ImageWorkspaceViewer({ files }: ImageWorkspaceViewerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(files[0] || null);

  return (
    <div className="flex flex-col gap-12">
      {files.map((file, index) => (
        <div key={index} className="flex flex-col gap-4">
          
          {/* Image with highlight frame */}
          <div className="relative inline-block self-center">
            <img
              src={URL.createObjectURL(file)}
              alt={`Question ${index + 1}`}
              className="max-w-full object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
