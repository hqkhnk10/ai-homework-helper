import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Crop, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker properly
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;


interface PDFViewerProps {
  file: File;
  page?: number;
  zoom?: number;
  onPageChange?: (current: number, total: number) => void;
  onCropComplete?: (croppedFile: File) => void;
}

export default function PDFViewer({ file, page = 1, zoom = 100, onPageChange, onCropComplete }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const captureArea = async () => {
    if (!cropArea || !pageRef.current) return;

    try {
      // Create a canvas for the cropped area
      const canvas = document.createElement('canvas');
      const pdfElement = pageRef.current.querySelector('.react-pdf__Page');
      if (!pdfElement) return;

      const rect = pdfElement.getBoundingClientRect();
      const scaleFactor = window.devicePixelRatio;

      // Set canvas size to match the cropped area
      canvas.width = cropArea.width * scaleFactor;
      canvas.height = cropArea.height * scaleFactor;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Use html2canvas with proper scaling and positioning
      const html2canvas = (await import('html2canvas')).default;
      const screenshot = await html2canvas(pdfElement as HTMLElement, {
        scale: scaleFactor,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        x: cropArea.x,
        y: cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
        windowWidth: rect.width,
        windowHeight: rect.height
      });

      // Draw the screenshot onto our canvas
      ctx.drawImage(screenshot, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-question.png', { type: 'image/png' });
          if (onCropComplete) {
            onCropComplete(file);
          }
          // Reset crop area after successful capture
          setCropArea(null);
          setIsCropping(false);
        }
      }, 'image/png', 1.0);

      console.log('canvas', canvas);
      
    } catch (error) {
      console.error('Error capturing area:', error);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleStartCrop = () => {
    setIsCropping(prev => !prev);
    if (isCropping) {
      setCropArea(null);
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  return (
    <div className="h-full w-[60%] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleStartCrop}
          className={`p-2 rounded-lg ${
            isCropping ? 'bg-gray-300' : 'hover:bg-gray-100'
          }`}
          title="Crop Question"
        >
          <div className="flex items-center space-x-1 border-1 border-purple-700 rounded-lg px-2 py-1 cursor-pointer">
            <Crop className="w-5 h-5 text-purple-700" /> <span className='text-purple-700'>Crop New Question</span>
          </div>
        </button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex justify-center" ref={containerRef}>
        <div
          className="relative inline-block"
          onMouseDown={(e) => {
            if (!isCropping) return;
            // Ignore if clicking on the Get Answer button
            if ((e.target as HTMLElement).tagName === 'BUTTON') return;
            
            e.preventDefault();
            const pdfElement = pageRef.current?.querySelector('.react-pdf__Page');
            if (!pdfElement) return;
            
            const rect = pdfElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only start drawing if click is inside the PDF
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
              setIsDrawing(true);
              setStartPoint({ x, y });
              setCropArea({ x, y, width: 0, height: 0 });
            }
          }}
          onMouseMove={(e) => {
            if (!isDrawing || !startPoint) return;
            e.preventDefault();
            const pdfElement = pageRef.current?.querySelector('.react-pdf__Page');
            if (!pdfElement) return;
            
            const rect = pdfElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            requestAnimationFrame(() => {
              const width = x - startPoint.x;
              const height = y - startPoint.y;
              
              setCropArea({
                x: width > 0 ? startPoint.x : x,
                y: height > 0 ? startPoint.y : y,
                width: Math.abs(width),
                height: Math.abs(height)
              });
            });
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            if (isDrawing) {
              setIsDrawing(false);
              setStartPoint(null);
            }
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            if (isDrawing) {
              setIsDrawing(false);
              setStartPoint(null);
            }
          }}
        >
          <div ref={pageRef}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                }
              />
            </Document>
          </div>

          {cropArea && (
            <>
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
              >
                {/* Corner circles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
              </div>
              {!isDrawing && (
                <button
                  onClick={captureArea}
                  className="z-10000 absolute px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                  style={{
                    left: cropArea.x + (cropArea.width / 2),
                    top: cropArea.y + cropArea.height + 16,
                    transform: 'translateX(-50%)'
                  }}
                >
                  Get Answer
                </button>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
