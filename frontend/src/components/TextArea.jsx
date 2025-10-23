import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Download, Copy, AlertCircle, Loader2, FileText, Eye } from 'lucide-react';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { marked } from 'marked';
import './markdown-styles.css';

export default function TextArea({
                                     extractedText,
                                     setExtractedText,
                                     isTextAreaFocused,
                                     setIsTextAreaFocused,
                                     isProcessing,
                                     ocrError
                                 }) {
    const [isMarkdownMode, setIsMarkdownMode] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleCopy = () => {
        if (extractedText && extractedText !== 'Распознавание текста...') {
            navigator.clipboard.writeText(extractedText);
        }
    };

    const handleExportMarkdown = () => {
        if (!extractedText || extractedText === 'Распознавание текста...') return;
        const blob = new Blob([extractedText], { type: 'text/markdown;charset=utf-8' });
        const fileName = `extracted_text_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.md`;
        saveAs(blob, fileName);
        setShowExportMenu(false);
    };

   const handleExportDocx = () => {
        if (!extractedText || extractedText === 'Распознавание текста...') return;

        // Конвертируем Markdown в HTML
        const htmlBody = marked(extractedText);

        const htmlContent = `
            <html>
            <head>
                <meta charset="utf-8"/>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 12pt; color: #000; }
                    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                    td, th { border: 1px solid #000; padding: 4px; }
                    div, p { margin: 6px 0; }
                    h1, h2, h3 { color: #222; }
                </style>
            </head>
            <body>
                ${htmlBody}
            </body>
            </html>
        `;

        const blob = htmlDocx.asBlob(htmlContent);
        const fileName = `extracted_text_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.docx`;
        saveAs(blob, fileName);
        setShowExportMenu(false);
    };

    const handleTextChange = (e) => setExtractedText(e.target.value);
    const toggleMode = () => setIsMarkdownMode(!isMarkdownMode);

    return (
        <div className="flex-1 bg-[#3a3a3a] backdrop-blur-sm rounded-xl border border-gray-700/30 flex flex-col p-4 max-h-[90vh]">
            <div className="flex-1 scrollbar-custom overflow-auto relative p-3">
                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                        <div>
                            <div className="w-12 h-12 bg-[#404040] rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                            </div>
                            <p className="text-blue-300 text-sm">Распознавание текста...</p>
                        </div>
                    </div>
                )}

                {ocrError && !isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                        <div>
                            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <p className="text-red-300 text-sm max-w-xs">{ocrError}</p>
                        </div>
                    </div>
                )}

                {!isProcessing && !ocrError && (
                    <>
                        {isMarkdownMode ? (
                            <div className="prose prose-invert max-w-none text-gray-200">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {extractedText}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                value={extractedText}
                                onChange={handleTextChange}
                                onFocus={() => setIsTextAreaFocused(true)}
                                onBlur={() => setIsTextAreaFocused(false)}
                                className="w-full bg-transparent text-gray-200 resize-none focus:outline-none font-mono text-sm min-h-full"
                                placeholder="Здесь появится распознанный текст..."
                                rows={extractedText.split('\n').length || 10}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Далее уже панель кнопок */}
            <div className="flex justify-between items-center mt-4 -mx-2 -mb-2">
                <div className="flex gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isProcessing || !extractedText || extractedText === 'Распознавание текста...' || ocrError || !isMarkdownMode}
                            className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Экспортировать
                        </button>

                        {showExportMenu && (
                            <div className="absolute bottom-full mb-2 left-0 bg-[#464646] rounded-lg border border-gray-600 shadow-lg overflow-hidden min-w-[180px]">
                                <button
                                    onClick={handleExportMarkdown}
                                    className="w-full px-4 py-2 text-left text-white text-sm hover:bg-[#4b4b4b] transition-colors flex items-center"
                                >
                                    <img src="/markdown.svg" alt="Markdown" className="w-4 h-4 mr-2" />
                                    Markdown (.md)
                                </button>
                                <button
                                    onClick={handleExportDocx}
                                    className="w-full px-4 py-2 text-left text-white text-sm hover:bg-[#4b4b4b] transition-colors flex items-center"
                                >
                                    <img src="/word.svg" alt="Word" className="w-4 h-4 mr-2" />
                                    Word (.docx)
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleCopy}
                        disabled={isProcessing || !extractedText || extractedText === 'Распознавание текста...' || ocrError}
                        className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Копировать
                    </button>
                </div>

                <button
                    onClick={toggleMode}
                    disabled={isProcessing || !extractedText || extractedText === 'Распознавание текста...' || ocrError}
                    className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isMarkdownMode ? (
                        <>
                            <FileText className="w-4 h-4 mr-2" />
                            Разметка
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4 mr-2" />
                            Просмотр
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}