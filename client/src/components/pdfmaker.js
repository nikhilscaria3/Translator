import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/PDFMaker.css';

function PDFMaker() {
  // Load the editor content from local storage or set an initial value
  const [editorHtml, setEditorHtml] = useState(() => {
    const storedContent = localStorage.getItem('editorContent');
    return storedContent ? storedContent : '';
  });

  // Save editor content to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('editorContent', editorHtml);
  }, [editorHtml]);

  const handlePrintPDF = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>PDF Output</title>
          <link rel="stylesheet" href="path/to/your/print-styles.css" type="text/css" media="print">
        </head>
        <body>
          ${editorHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Text Editor</h1>
              <div className="editor-container">
                <ReactQuill 
                  value={editorHtml}
                  onChange={setEditorHtml}
                  placeholder="Enter text here..."
                />
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handlePrintPDF}>Print as PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFMaker;
