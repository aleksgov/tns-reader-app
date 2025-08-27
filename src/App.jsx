import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import FilePanel from './components/FilePanel';
import ImageViewer from './components/ImageViewer';
import TextArea from './components/TextArea';

export default function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [history, setHistory] = useState([]);
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);

    // Загрузка истории при запуске
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('imageToTextHistory') || '[]');
        setHistory(savedHistory);
    }, []);

    // Сохранение истории при ее изменении
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

    return (
        <div className="h-screen bg-gradient-to-br bg-[#2b2b2b] flex flex-col">
            <TitleBar />

            <div className="flex flex-1 gap-2">
                <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />

                <div className="flex-1 bg-[#303030] rounded-l-2xl border border-gray-700/30 mt-3 p-8">
                    <div className="flex flex-row gap-2 h-full">
                        <FilePanel
                            isSidebarOpen={isSidebarOpen}
                            handleFileUpload={handleFileUpload}
                            history={history}
                            handleHistoryFileClick={handleHistoryFileClick}
                            handleDeleteFile={handleDeleteFile}
                            handleDeleteAll={handleDeleteAll}
                        />

                        <ImageViewer
                            selectedImage={selectedImage}
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />

                        <TextArea
                            extractedText={extractedText}
                            setExtractedText={setExtractedText}
                            isTextAreaFocused={isTextAreaFocused}
                            setIsTextAreaFocused={setIsTextAreaFocused}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}