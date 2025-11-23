"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm border-b fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

       
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
          TeamFlow
        </Link>

    
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/projects" className="hover:text-blue-600">Projects</Link>
          <Link href="/tasks" className="hover:text-blue-600">Tasks</Link>
        </div>

        <div className="flex items-center gap-4">

     
          {user && (
            <span className="hidden md:block text-gray-600">
              {user.name}
            </span>
          )}

          {user && (
            <button
              onClick={logout}
              className="hidden md:block px-3 py-1 bg-gray-900 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
