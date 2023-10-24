import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default: Spanish

  const handleTranslate = async () => {
    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage }),
      });
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Translator App</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="input-group mb-3">
            <textarea
              className="form-control"
              placeholder="Enter text to translate"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* Add more language options as needed */}
            </select>
            <button className="btn btn-primary" onClick={handleTranslate}>
              Translate
            </button>
          </div>
          {translatedText && (
            <div className="alert alert-success" role="alert">
              <h2 className="mb-3">Translation:</h2>
              <p>{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
