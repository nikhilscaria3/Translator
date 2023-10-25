import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Correct the file path if necessary
import PDFMAKER from './components/pdfmaker';
import TRANSLATOR from './components/translator';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/pdf" element={<PDFMAKER />} />
        <Route path="/" element={<TRANSLATOR />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
