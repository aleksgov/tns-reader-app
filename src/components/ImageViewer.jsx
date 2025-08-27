import React from 'react';
import { FolderOpen, Clipboard, Image, ChevronLeft } from 'lucide-react';

export default function ImageViewer({
                                        selectedImage,
                                        isSidebarOpen,
                                        setIsSidebarOpen
                                    }) {
    return (
        <div className="flex-1 rounded-xl border bg-[#3a3a3a] border-gray-700/30 flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center">
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                ) : (
                    <div className="text-center opacity-50">
                        <div className="w-20 h-20 bg-[#404040] rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Image className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-300 text-sm">Изображение не выбрано</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-end mt-4 -mx-2 -mb-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center justify-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-md transition-colors text-white"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
                    </button>
                    <button className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-md transition-colors text-white text-sm">
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Открыть файл(ы)
                    </button>
                </div>
                <button className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-md transition-colors text-white text-sm">
                    <Clipboard className="w-4 h-4 mr-2" />
                    Вставить
                </button>
            </div>
        </div>
    );
}