import React, { useState } from 'react';
import { Menu, Trash2, FolderOpen, Copy, Share, Clipboard, Settings, Image } from 'lucide-react';

export default function ImageToTextApp() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [history, setHistory] = useState([
        {
          id: 1,
          name: 'test2.png',
          date: '26.08.2025 14:02:09',
          type: 'png'
        },
        {
          id: 2,
          name: 'test.jpg',
          date: '26.08.2025 14:02:02',
          type: 'jpg'
        },
    ]);

    const handleDeleteFile = (id) => {
      setHistory(history.filter(file => file.id !== id));
    };

    const handleDeleteAll = () => {
      setHistory([]);
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          setExtractedText('some text');
        };
        reader.readAsDataURL(file);
      }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 flex flex-col">
          <div className="flex flex-1 p-4 gap-4">
            {/* Левое боковое меню */}
            <div className="w-72 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 flex flex-col">
              {/* Заголовок */}
              <div className="flex items-center p-4">
                <Menu className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
              </div>

              {/* Выбранные файлы */}
              <div className="px-4 pb-4">
                <h3 className="text-white font-medium text-sm mb-3">Selected Files</h3>
                <div className="bg-gray-700/30 rounded-xl p-8 border-2 border-dashed border-gray-600/40 text-center">
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                  />
                  <label
                      htmlFor="file-upload"
                      className="cursor-pointer block hover:bg-gray-600/20 p-4 rounded-lg transition-colors"
                  >
                    <div className="text-gray-500 text-xs">Перетащите файлы сюда или нажмите чтобы выбрать</div>
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
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors group"
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <div className={`w-7 h-5 rounded text-xs font-bold flex items-center justify-center mr-3 text-white flex-shrink-0 ${
                              file.type === 'png' ? 'bg-purple-600' : 'bg-green-600'
                          }`}>
                            {file.type}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white text-xs font-medium truncate">{file.name}</div>
                            <div className="text-gray-400 text-xs">{file.date}</div>
                          </div>
                        </div>
                        <button
                            onClick={() => handleDeleteFile(file.id)}
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
                  Delete All
                </button>
              </div>

              {/*Кнопка настроек */}
              <div className="p-4">
                <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
              </div>
            </div>

            {/* Правая область */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Правая область для изображения */}
              <div className="flex-1 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  {selectedImage ? (
                      <img
                          src={selectedImage}
                          alt="Selected"
                          className="max-w-full max-h-full object-contain rounded-lg"
                      />
                  ) : (
                      <div className="text-center opacity-50">
                        <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Image className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">Изображение не выбрано</p>
                      </div>
                  )}
                </div>
              </div>

              {/* Нижняя область для вывода текста */}
              <div className="h-64 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
                {extractedText ? (
                    <div className="h-full">
                      <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap overflow-auto h-full">
                        {extractedText}
                      </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center opacity-50">
                      <div>
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Copy className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">Извлечённый текст появится здесь</p>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Нижняя панель с кнопками */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white text-sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Открыть файл(ы)
                </button>

                <button className="flex items-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white text-sm">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Вставить
                </button>

                <button className="flex items-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white text-sm">
                  <Share className="w-4 h-4 mr-2" />
                  Поделится
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white text-sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </button>
              </div>
            </div>
          </div>
        </div>
    );
}