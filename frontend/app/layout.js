"use client";

import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "../components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
