import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import FilePanel from './components/FilePanel';
import ImageViewer from './components/ImageViewer';
import TextArea from './components/TextArea';
import { recognizeText } from './utils/ocrService';

export default function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [history, setHistory] = useState([]);
    const [openFiles, setOpenFiles] = useState([]);
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [ocrError, setOcrError] = useState(null);

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

    // Функция для распознавания текста
    const processImageWithOCR = async (file, imageData) => {
        setIsProcessing(true);
        setOcrError(null);
        setExtractedText('Распознавание текста...');

        try {
            let recognizedText;
            if (file) {
                recognizedText = await recognizeText(file);
            } else if (imageData) {
                // base64 -> Blob
                const res = await fetch(imageData);
                const blob = await res.blob();
                const tempFile = new File([blob], "clipboard.png", { type: blob.type });
                recognizedText = await recognizeText(tempFile);
            }

            setExtractedText(recognizedText || 'Текст не найден');
            return recognizedText;
        } catch (error) {
            console.error('Ошибка OCR:', error);
            setOcrError('Ошибка при распознавании текста. Проверьте подключение к серверу.');
            setExtractedText('Ошибка распознавания');
            return 'Ошибка распознавания';
        } finally {
            setIsProcessing(false);
        }
    };

    const addToHistory = (file, imageData, fileName = null, extractedText = '') => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');

        let fileType, name;
        if (file) {
            fileType = file.name.split('.').pop().toLowerCase();
            name = file.name;
        } else {
            name = fileName || 'Вставленное изображение';
            fileType = 'png';
        }

        const historyItem = {
            id: Date.now() + Math.random(),
            name: name,
            date: dateStr,
            type: fileType,
            imageData: imageData,
            extractedText: extractedText
        };

        setHistory(prev => [historyItem, ...prev]);
    };

    const addToOpenFiles = (file, imageData, fileName = null, extractedText = '') => {
        let fileType, name;
        if (file) {
            fileType = file.name.split('.').pop().toLowerCase();
            name = file.name;
        } else {
            name = fileName || 'Вставленное изображение';
            fileType = 'png';
        }

        const openFileItem = {
            id: Date.now() + Math.random(),
            name: name,
            type: fileType,
            imageData: imageData,
            extractedText: extractedText
        };

        setOpenFiles(prev => [openFileItem, ...prev]);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageData = e.target.result;
                setSelectedImage(imageData);

                const recognizedText = await processImageWithOCR(file, imageData);

                // Добавляем в оба списка
                addToHistory(file, imageData, null, recognizedText);
                addToOpenFiles(file, imageData, null, recognizedText);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenFiles = async (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = async (e) => {
                    const imageData = e.target.result;

                    if (i === 0) {
                        setSelectedImage(imageData);
                        // Распознаём текст только для первого изображения
                        const recognizedText = await processImageWithOCR(file, imageData);
                        addToHistory(file, imageData, null, recognizedText);
                        addToOpenFiles(file, imageData, null, recognizedText);
                    } else {
                        // Для остальных изображений добавляем без распознавания
                        setTimeout(() => {
                            addToHistory(file, imageData, null, '');
                            addToOpenFiles(file, imageData, null, '');
                        }, i * 10);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
        event.target.value = '';
    };

    const handlePasteImage = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();

            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        const blob = await clipboardItem.getType(type);

                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            const imageData = e.target.result;

                            const now = new Date();
                            const timestamp = now.toLocaleTimeString('ru-RU').replace(/:/g, '-');
                            const fileName = `Скриншот ${timestamp}`;

                            setSelectedImage(imageData);

                            const recognizedText = await processImageWithOCR(null, imageData);

                            addToHistory(null, imageData, fileName, recognizedText);
                            addToOpenFiles(null, imageData, fileName, recognizedText);
                        };
                        reader.readAsDataURL(blob);
                        return;
                    }
                }
            }

            alert('В буфере обмена нет изображений');

        } catch (error) {
            console.error('Ошибка при вставке изображения:', error);
            alert('Не удалось получить изображение из буфера обмена');
        }
    };

    const handleHistoryFileClick = (historyItem) => {
        setSelectedImage(historyItem.imageData);
        setExtractedText(historyItem.extractedText || 'Текст не сохранён');
        setOcrError(null);
    };

    const handleOpenFileClick = async (openFileItem) => {
        setSelectedImage(openFileItem.imageData);

        if (openFileItem.extractedText) {
            setExtractedText(openFileItem.extractedText);
        } else {
            await processImageWithOCR(null, openFileItem.imageData);
        }
        setOcrError(null);
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
                            handlePasteImage={handlePasteImage}
                        />

                        <TextArea
                            extractedText={extractedText}
                            setExtractedText={setExtractedText}
                            isTextAreaFocused={isTextAreaFocused}
                            setIsTextAreaFocused={setIsTextAreaFocused}
                            isProcessing={isProcessing}
                            ocrError={ocrError}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}