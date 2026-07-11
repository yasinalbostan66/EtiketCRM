import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etiket CRM",
  description: "Matbaa malzemeleri yönetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
