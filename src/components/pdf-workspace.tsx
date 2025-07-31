"use client"

import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatInterface } from './chat-interface';

import dynamic from 'next/dynamic';

// Dynamically import the PdfViewer component, disabling server-side rendering
const PdfViewer = dynamic(() => import('./pdf-viewer'), {
  ssr: false,
});

interface PDFWorkspaceProps {
    files: File[];
    onGetAnswer: (selectedFile: File[], text?: string) => void;
    showChat?: boolean;
    initialText?: string;
}

interface CroppedArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function PDFWorkspace({ files, onGetAnswer, showChat = false, initialText = '' }: PDFWorkspaceProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(files[0] || null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const viewerRef = useRef<HTMLDivElement>(null);

    const handleCrop = (croppedFile: File) => {
        if (selectedFile) {
            // Here you would normally extract text from the cropped area
            // For now, we'll just pass a placeholder
            onGetAnswer([croppedFile]);
        }
    };

    const handleGetAnswer = () => {
        if (files.length > 0) {
            onGetAnswer(files, "I need help with this PDF");
        }
    };

    return (
        <div className="w-full flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
                {/* PDF View */}
                <div className="flex-1 overflow-hidden flex justify-center items-center relative">
                    {selectedFile && (
                        <PdfViewer
                            file={selectedFile}
                            page={currentPage}
                            zoom={zoom}
                            onPageChange={(current: number, total: number) => {
                                setCurrentPage(current);
                                setTotalPages(total);
                            }}
                            onCropComplete={handleCrop}
                        />
                    )}
                </div>
            </div>

            {/* Right panel - Instructions or Chat */}
            {
                !showChat && (<div className="w-[500px] p-4 border-l flex flex-col overflow-hidden">

                    <img
                        src="/image 21.png"
                        alt="Instructions"
                        className="w-full  object-cover"
                    />
                </div>)
            }

        </div>
    );
}
