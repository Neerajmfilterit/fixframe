import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "AI Dashboard Builder",
  description: "Drag-and-drop fraud analytics dashboard with AI assistance"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
