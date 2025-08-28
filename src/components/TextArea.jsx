import React from 'react';
import { Download, Copy } from 'lucide-react';

export default function TextArea({
                                     extractedText,
                                     setExtractedText,
                                     isTextAreaFocused,
                                     setIsTextAreaFocused
                                 }) {
    return (
        <div className="flex-1 bg-[#3a3a3a] backdrop-blur-sm rounded-xl border border-gray-700/30 flex flex-col p-4">
            <div className="flex-1 overflow-hidden relative">
                <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    onFocus={() => setIsTextAreaFocused(true)}
                    onBlur={() => setIsTextAreaFocused(false)}
                    placeholder=""
                    className={`w-full h-full resize-none outline-none text-gray-200 text-sm leading-relaxed rounded-sm transition-colors p-3 ${
                        isTextAreaFocused ? 'bg-[#272727]' : 'bg-[#464646]'
                    }`}
                />
                {!extractedText && !isTextAreaFocused && (
                    <div className="absolute inset-0 flex items-center justify-center text-center opacity-50 pointer-events-none">
                        <div>
                            <div className="w-12 h-12 bg-[#404040] rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Copy className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-300 text-sm">Извлечённый текст появится здесь</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-4 -mx-2 -mb-2">
                <button
                    className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Экспортировать
                </button>
                <button className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать
                </button>
            </div>
        </div>
    );
}
