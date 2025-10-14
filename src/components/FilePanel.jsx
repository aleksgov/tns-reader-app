import React from 'react';
import { Trash2 } from 'lucide-react';

export default function FilePanel({
                                      isSidebarOpen,
                                      handleFileUpload,
                                      openFiles,
                                      handleOpenFileClick,
                                      handleDeleteOpenFile,
                                      history,
                                      handleHistoryFileClick,
                                      handleDeleteFile,
                                      handleDeleteAll
                                  }) {
    return (
        <div className={`bg-[#3a3a3a] backdrop-blur-sm rounded-xl border border-gray-700/30 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden opacity-0'}`}>
            {/* Выбранные файлы */}
            <div className="px-4 pb-4 pt-4">
                <h3 className="text-white font-medium text-sm mb-3">Выбранные файлы</h3>
                {openFiles.length > 0 ? (
                    <div className="space-y-1 mb-3">
                        {openFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
                                onClick={() => handleOpenFileClick(file)}
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
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteOpenFile(file.id);
                                    }}
                                    className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
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
                            <div className="text-gray-300 text-xs">
                                Перетащите файлы сюда или нажмите чтобы выбрать
                            </div>
                        </label>
                    </div>
                )}
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
            <div className="p-4 border-t border-gray-700/30 -mb-2 -mx-2">
                <button
                    onClick={handleDeleteAll}
                    className="flex items-center justify-center w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить все
                </button>
            </div>
        </div>
    );
}