import React from "react";
import Link from "next/link";

export const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: "📊" },
    { name: "Firmalar", href: "/firmalar", icon: "🏢" },
    { name: "Siparişler", href: "/siparisler", icon: "📦" },
    { name: "Stok Takibi", href: "/stok", icon: "📋" },
    { name: "Muhasebe", href: "/muhasebe", icon: "💰" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-xl font-bold text-blue-600 tracking-tight">EtiketCRM</span>
      </div>
      
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium text-sm"
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
          <span>🚪</span> Çıkış Yap
        </button>
      </div>
    </aside>
  );
};
