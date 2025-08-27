import React, { useState, useEffect } from 'react';
import { Menu, Trash2, FolderOpen, Copy, Share, Clipboard, Settings, Image, ChevronLeft } from 'lucide-react';

export default function ImageToTextApp() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [history, setHistory] = useState([]);
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);

    // загрузка истории при запуске
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('imageToTextHistory') || '[]');
        setHistory(savedHistory);
    }, []);

    // сохранение истории при ее изменении
    useEffect(() => {
        localStorage.setItem('imageToTextHistory', JSON.stringify(history));
    }, [history]);

    const handleDeleteFile = (id) => {
        setHistory(history.filter(file => file.id !== id));
    };

    const handleDeleteAll = () => {
        setHistory([]);
    };

    const addToHistory = (file, imageData) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');
        const fileType = file.name.split('.').pop().toLowerCase();

        const historyItem = {
            id: Date.now(),
            name: file.name,
            date: dateStr,
            type: fileType,
            imageData: imageData
        };

        setHistory(prev => [historyItem, ...prev]);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setSelectedImage(imageData);
                setExtractedText('some text');
                addToHistory(file, imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleHistoryFileClick = (historyItem) => {
        setSelectedImage(historyItem.imageData);
        setExtractedText('some text');
    };

    const handleMinimize = () => {
        if (window.electronAPI) {
            window.electronAPI.minimize();
        }
    };

    const handleMaximize = () => {
        if (window.electronAPI) {
            window.electronAPI.maximize();
        }
    };

    const handleClose = () => {
        if (window.electronAPI) {
            window.electronAPI.close();
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br bg-[#2b2b2b] flex flex-col">
            {/* напишем кастомный заголовок для приложения так как мне не нравится изменение цвета заголовка windows  */}
            <div className="bg-[#2b2b2b] border-b border-gray-700/30 flex items-stretch justify-between h-8" style={{"-webkit-app-region": "drag"}}>
                <div className="text-white text-sm font-medium px-4 flex items-center h-full">TNS Reader</div>
                                <div className="flex h-full" style={{"-webkit-app-region": "no-drag"}}>
                    {/* кнопка сворачивания */}
                    <button
                        onClick={handleMinimize}
                        className="w-12 flex-1 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                    >
                        <div className="w-3 h-px bg-white"></div>
                    </button>
                    {/* кнопка разворачивания */}
                    <button
                        onClick={handleMaximize}
                        className="w-12 flex-1 flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                    >
                        <div className="w-2.5 h-2.5 border-[1.5px] border-white rounded-sm"></div>
                    </button>
                    {/* кнопка закрытия */}
                    <button
                        onClick={handleClose}
                        className="w-12 flex-1 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <div className="w-3 h-3 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-px bg-white rotate-45"></div>
                                <div className="w-3 h-px bg-white -rotate-45 absolute"></div>
                            </div>
                        </div>
                    </button>

                </div>
            </div>
            <div className="flex flex-1 p-2 gap-2">
                {/* Боковая панель меню */}
                <div className={`bg-[#2b2b2b] backdrop-blur-sm rounded-2xl border border-gray-700/30 flex flex-col transition-all duration-300 overflow-hidden ${isMenuOpen ? 'w-72' : 'w-8'}`}>
                    {/* Иконка меню */}
                    <div className={`flex items-center p-4 ${isMenuOpen ? '' : 'justify-center'}`}>
                        <Menu
                            className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white flex-shrink-0"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                        {isMenuOpen && <span className="ml-2 text-white text-sm">Меню</span>}
                    </div>

                    <div className={`flex items-center p-4 ${isMenuOpen ? '' : 'justify-center'} mt-auto`}>
                        <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white flex-shrink-0" />
                        {isMenuOpen && <span className="ml-2 text-white text-sm">Настройки</span>}
                    </div>
                </div>

                {/* Основная рабочая область */}
                <div className="flex-1 bg-[#303030] rounded-2xl border border-gray-700/30 p-8">
                    <div className="flex flex-row gap-2 h-full">
                        {/* Область файлов */}
                        <div className={`bg-[#3a3a3a] backdrop-blur-sm rounded-xl border border-gray-700/30 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden opacity-0'}`}>
                            {/* Выбранные файлы */}
                            <div className="px-4 pb-4 pt-4">
                                <h3 className="text-white font-medium text-sm mb-3">Выбранные файлы</h3>
                                <div className="bg-gray-700/30 rounded-xl p-6 border-2 border-dashed border-gray-600/40 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer block hover:bg-gray-700/30 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="text-gray-300 text-xs">Перетащите файлы сюда или нажмите чтобы выбрать</div>
                                    </label>
                                </div>
                            </div>

                            {/* История */}
                            <div className="flex-1 px-4 pb-4 overflow-auto">
                                <h3 className="text-white font-medium text-sm mb-3">История</h3>
                                <div className="space-y-1">
                                    {history.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
                                            onClick={() => handleHistoryFileClick(file)}
                                        >
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className={`w-7 h-5 rounded text-xs font-bold flex items-center justify-center mr-3 text-white flex-shrink-0 ${
                                                    file.type === 'png' ? 'bg-purple-600' :
                                                        file.type === 'jpg' || file.type === 'jpeg' ? 'bg-green-600' :
                                                            'bg-blue-600'
                                                }`}>
                                                    {file.type}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-white text-xs font-medium truncate">{file.name}</div>
                                                    <div className="text-gray-400 text-xs">{file.date}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFile(file.id);
                                                }}
                                                className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Кнопка для удаления всего */}
                            <div className="p-4 border-t border-gray-700/30">
                                <button
                                    onClick={handleDeleteAll}
                                    className="flex items-center justify-center w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Удалить все
                                </button>
                            </div>
                        </div>

                        {/* Область для изображения */}
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

                        {/* Область для текста */}
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
                                <button className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm">
                                    <Share className="w-4 h-4 mr-2" />
                                    Поделится
                                </button>
                                <button className="flex items-center px-3 py-2 bg-[#464646] hover:bg-[#4b4b4b] rounded-lg transition-colors text-white text-sm">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Копировать
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}