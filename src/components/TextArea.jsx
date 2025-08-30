import React from 'react';
import { Download, Copy, AlertCircle, Loader2 } from 'lucide-react';

export default function TextArea({
                                     extractedText,
                                     setExtractedText,
                                     isTextAreaFocused,
                                     setIsTextAreaFocused,
                                     isProcessing,
                                     ocrError
                                 }) {

    const handleCopy = () => {
        if (extractedText && extractedText !== 'Распознавание текста...') {
            navigator.clipboard.writeText(extractedText);
        }
    };

    const handleExport = () => {
        if (extractedText && extractedText !== 'Распознавание текста...') {
            const blob = new Blob([extractedText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracted_text_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="flex-1 bg-[#3a3a3a] backdrop-blur-sm rounded-xl border border-gray-700/30 flex flex-col p-4">
            <div className="flex-1 overflow-hidden relative">
                <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    onFocus={() => setIsTextAreaFocused(true)}
                    onBlur={() => setIsTextAreaFocused(false)}
                    placeholder=""
                    disabled={isProcessing}
                    className={`w-full h-full resize-none outline-none text-gray-200 text-sm leading-relaxed rounded-sm transition-colors p-3 ${
                        isTextAreaFocused ? 'bg-[#272727]' : 'bg-[#464646]'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                />

                {!extractedText && !isTextAreaFocused && !isProcessing && !ocrError && (
                    <div className="absolute inset-0 flex items-center justify-center text-center opacity-50 pointer-events-none">
                        <div>
                            <div className="w-12 h-12 bg-[#404040] rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Copy className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-300 text-sm">Извлечённый текст появится здесь</p>
                        </div>
                    </div>
                )}

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
                            <p className="text-red-300 text-sm max-w-xs">
                                {ocrError}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-4 -mx-2 -mb-2">
                <button
                    onClick={handleExport}
                    disabled={isProcessing || !extractedText || extractedText === 'Распознавание текста...' || ocrError}
                    className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Экспортировать
                </button>
                <button
                    onClick={handleCopy}
                    disabled={isProcessing || !extractedText || extractedText === 'Распознавание текста...' || ocrError}
                    className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать
                </button>
            </div>
        </div>
    );
}