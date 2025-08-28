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
    const [openFiles, setOpenFiles] = useState([]);
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

    const handleDeleteOpenFile = (id) => {
        setOpenFiles(openFiles.filter(file => file.id !== id));
    };

    const addToHistory = (file, imageData) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');
        const fileType = file.name.split('.').pop().toLowerCase();

        const historyItem = {
            id: Date.now() + Math.random(), // Делаем ID более уникальным
            name: file.name,
            date: dateStr,
            type: fileType,
            imageData: imageData
        };

        setHistory(prev => [historyItem, ...prev]);
    };

    const addToOpenFiles = (file, imageData) => {
        const fileType = file.name.split('.').pop().toLowerCase();

        const openFileItem = {
            id: Date.now() + Math.random(), // Делаем ID более уникальным
            name: file.name,
            type: fileType,
            imageData: imageData
        };

        setOpenFiles(prev => [openFileItem, ...prev]);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setSelectedImage(imageData);
                setExtractedText('some text');

                // Добавляем в оба списка
                addToHistory(file, imageData);
                addToOpenFiles(file, imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenFiles = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;

                    if (index === 0) {
                        setSelectedImage(imageData);
                        setExtractedText('some text');
                    }
                    setTimeout(() => {
                        addToHistory(file, imageData);
                        addToOpenFiles(file, imageData);
                    }, index * 10);
                };
                reader.readAsDataURL(file);
            });
        }
        event.target.value = '';
    };

    const handleHistoryFileClick = (historyItem) => {
        setSelectedImage(historyItem.imageData);
        setExtractedText('some text');
    };

    const handleOpenFileClick = (openFileItem) => {
        setSelectedImage(openFileItem.imageData);
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
                            openFiles={openFiles}
                            handleOpenFileClick={handleOpenFileClick}
                            handleDeleteOpenFile={handleDeleteOpenFile}
                            history={history}
                            handleHistoryFileClick={handleHistoryFileClick}
                            handleDeleteFile={handleDeleteFile}
                            handleDeleteAll={handleDeleteAll}
                        />

                        <ImageViewer
                            selectedImage={selectedImage}
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                            handleOpenFiles={handleOpenFiles}
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