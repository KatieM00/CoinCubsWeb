// @ts-nocheck
import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X, Check } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFFormViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formTitle: string;
  formDescription: string;
  pdfUrl?: string;
  onSign?: (signatureData: string) => Promise<void>;
  isViewOnly?: boolean;
}

export default function PDFFormViewer({
  open,
  onOpenChange,
  formTitle,
  formDescription,
  pdfUrl,
  onSign,
  isViewOnly = false,
}: PDFFormViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    toast.error('Failed to load PDF document');
    setIsLoading(false);
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSign = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Please provide a signature');
      return;
    }

    const signatureData = signatureRef.current.toDataURL();
    setIsSigning(true);

    try {
      await onSign?.(signatureData);
      toast.success('Form signed successfully!');
      onOpenChange(false);
      clearSignature();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign form');
    } finally {
      setIsSigning(false);
    }
  };

  // Mock PDF URL if none provided (for demo purposes)
  const mockPdfUrl = pdfUrl || 'https://pdfobject.com/pdf/sample.pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50 p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">Loading document...</span>
            </div>
          )}

          <Document
            file={mockPdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={Math.min(window.innerWidth * 0.8, 800)}
            />
          </Document>

          {numPages > 0 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                disabled={pageNumber === numPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {!isViewOnly && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label className="text-base font-semibold mb-2 block">Digital Signature</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-32 cursor-crosshair',
                  }}
                  backgroundColor="white"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="mt-2"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Signature
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  clearSignature();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSign} disabled={isSigning}>
                {isSigning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Sign & Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {isViewOnly && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
