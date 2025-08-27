import React from 'react';
import { Menu, Settings } from 'lucide-react';

export default function Sidebar({ isMenuOpen, setIsMenuOpen }) {
    return (
        <div className={`bg-[#2b2b2b] backdrop-blur-sm flex flex-col transition-all duration-300 overflow-hidden ${isMenuOpen ? 'w-72' : 'w-11'}`}>
            {/* Иконка меню */}
            <div className="flex items-center h-12 w-full">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center w-full h-full px-4 justify-start gap-2"
                >
                    <Menu className="w-5 h-5 text-gray-300 hover:text-white flex-shrink-0" />
                    {isMenuOpen && <span className="text-white text-sm">Меню</span>}
                </button>
            </div>

            <div className="flex items-center h-12 mt-auto w-full">
                <button className="flex items-center w-full h-full px-4 justify-start gap-2">
                    <Settings className="w-4 h-4 text-gray-400 hover:text-white flex-shrink-0" />
                    {isMenuOpen && <span className="text-white text-sm">Настройки</span>}
                </button>
            </div>
        </div>
    );
}