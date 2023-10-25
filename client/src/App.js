import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Correct the file path if necessary

import TRANSLATOR from './components/translator';


function App() {
  return (
    <BrowserRouter>
      <Routes>

       
        <Route path="/" element={<TRANSLATOR />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
