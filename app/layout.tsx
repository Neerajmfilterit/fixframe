import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "FixFrame – Freeze the Frame, Fix the Chaos",
  description: "Build, organize, and perfect dashboards with FixFrame."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
