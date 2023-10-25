import React, { useState, useRef, useEffect } from "react";
import { franc } from "franc";
import { faCopy, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faVolumeUp, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import axios from '../utils/baseapi'; // Import Axios
import '../styles/translator.css'
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/PDFMaker.css';



const languages = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "ceb", name: "Cebuano" },
    { code: "ny", name: "Chichewa" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "co", name: "Corsican" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "tl", name: "Filipino" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "fy", name: "Frisian" },
    { code: "gl", name: "Galician" },
    { code: "ml", name: "Malayalam" },
];

function TRANSLATOR() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("es");
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef();
    const navigate = useNavigate()
    const [editorHtml, setEditorHtml] = useState(() => {
        const storedContent = localStorage.getItem('editorContent');
        return storedContent ? storedContent : '';
    });
    const quillRef = useRef(null);

    useEffect(() => {
        if (quillRef.current) {
            quillRef.current.getEditor().root.innerHTML = translatedText;
        }
    }, [translatedText]);

    useEffect(() => {
        // Load translation history from localStorage
        const translationHistory = JSON.parse(localStorage.getItem("translationHistory")) || [];
        const lastTranslation = translationHistory[translationHistory.length - 1];

        if (lastTranslation) {
            setText(lastTranslation.text);
            setTranslatedText(lastTranslation.translatedText);
            setTargetLanguage(lastTranslation.targetLanguage);
        }
    }, []);



    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => {
            setIsSpeaking(false);
        };
        setIsSpeaking(true);
    };


    const recognition = new window.webkitSpeechRecognition();
    const synth = window.speechSynthesis;

    if (!recognition || !synth) {
        console.error("Speech recognition or synthesis is not supported in this browser.");
    }


    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };



    const startSpeechRecognition = () => {
        setIsRecording(true);
        textareaRef.current.focus();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
            handleTranslate(transcript, true);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const handleTranslate = async (inputText, isVoiceInput = false) => {
        try {
            setLoading(true);
            const sourceLanguage = franc(inputText);

            const response = await axios.post("/translate", {
                text: inputText,
                sourceLanguage,
                targetLanguage,
            });

            if (response.status >= 200 && response.status < 300) {
                const data = await response.data;
                setTranslatedText(data.translatedText);
                setIsCopied(false);

                if (!isVoiceInput) {
                    const translationHistory = JSON.parse(localStorage.getItem("translationHistory")) || [];
                    const newTranslation = {
                        text: inputText,
                        translatedText: data.translatedText,
                        sourceLanguage,
                        targetLanguage,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem("translationHistory", JSON.stringify([...translationHistory, newTranslation]));
                }
            } else {
                throw new Error("Translation failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setTranslatedText("Translation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(translatedText);
            setIsCopied(true);
        } catch (error) {
            console.error("Failed to copy text: ", error);
        }
    };




    const handleQuillChange = () => {
        if (quillRef.current) {
            setEditorHtml(quillRef.current.getEditor().root.innerHTML);
        }
    };

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
        <div className="container mt-1">
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <h1 className='navbrand'>Transo</h1>
                    </a>

                </div>
                {/* ... Navigation bar content ... */}
            </nav>
            <h1 className="text-center mb-4">Online Translator</h1>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="input-group mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Speak or type text to translate"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={5}
                            ref={textareaRef}
                        />
                        <button
                            className={`btn btn-primary ${isRecording ? "recording" : ""}`}
                            onClick={startSpeechRecognition}
                        >
                            <FontAwesomeIcon icon={faMicrophone} className="me-2" />
                            {isRecording ? "Recording..." : ""}
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Words: {text.length}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to clear the text?")) {
                                    setText("");
                                    setTranslatedText("");
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faXmarkCircle} className="me-2" /> Clear
                        </button>
                    </div>
                    <div className="input-group mb-3">
                        <select
                            className="form-select"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            {languages?.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <div className="bg-icon">
                            <button className="btn btn-primary" onClick={() => handleTranslate(text)}>
                                Translate
                            </button>
                            <span></span>
                        </div>

                    </div>
                    {loading && <div className="alert alert-info">Translating...</div>}

                    {translatedText && (
                        <div className="alert alert-success" role="alert">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                {isSpeaking ? <button className="btn btn-danger" onClick={stopSpeaking}>
                                    <FontAwesomeIcon icon={faVolumeOff} className="me-2" />
                                    Stop
                                </button>
                                    :

                                    <button className="btn btn-info" onClick={() => speakText(translatedText)}>
                                        <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
                                        Speak
                                    </button>
                                }
                                <button className="btn btn-success" onClick={handleCopy}>
                                    <FontAwesomeIcon icon={faCopy} className="me-2" />
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>

                            </div>
                            <h2 className="mb-3">Translation:</h2>
                            <div className="editor-container">
                                <ReactQuill
                                    ref={quillRef}
                                    value={editorHtml}
                                    onChange={handleQuillChange}
                                    placeholder="Enter text here..."
                                />
                            </div>
                            <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={handlePrintPDF}>Print as PDF</button>
                            </div>
                        </div>

                    )}

                </div>
            </div>
        </div >
    );
}

export default TRANSLATOR;
