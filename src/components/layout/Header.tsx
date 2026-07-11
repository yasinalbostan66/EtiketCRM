import React from "react";

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Hoş Geldiniz</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
          <span className="text-xl">🔔</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
          A
        </div>
      </div>
    </header>
  );
};
