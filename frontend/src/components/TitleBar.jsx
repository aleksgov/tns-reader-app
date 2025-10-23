import React from 'react';

export default function TitleBar() {
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
        <div className="bg-[#2b2b2b] flex items-stretch justify-between h-8 mb-0" style={{ "-webkit-app-region": "drag" }}>
            <div className="text-white text-sm font-medium px-4 mt-2 flex items-center">
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-4 h-4 mr-2"
                />
                TNS Reader
            </div>
            <div className="flex" style={{"-webkit-app-region": "no-drag"}}>
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
    );
}