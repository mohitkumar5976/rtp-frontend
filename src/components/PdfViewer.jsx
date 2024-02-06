import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.min.js";

function PdfViewer({ pdfFile, setTotalPages }) {
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setTotalPages(numPages);
  }

  return (
    <>
      <div className="bg-slate-200 overflow-auto h-96 relative">
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page) => {
              return (
                <>
                  <Page
                    pageNumber={page}
                    height={440}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </>
              );
            })}
        </Document>
      </div>
    </>
  );
}

export default PdfViewer;
