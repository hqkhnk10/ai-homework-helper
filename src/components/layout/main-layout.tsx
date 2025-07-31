import { ReactNode } from 'react';
import Link from 'next/link';
import { History, Chrome, Download, Menu } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b h-[64px]">
          <Link 
            href="/"
            className="flex items-center space-x-2 hover:text-gray-700 transition-colors"
            onClick={() => {
              // Reset all state
              window.location.href = '/';
            }}
          >
            <span className="font-bold text-xl">AI Homework Helper</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/homework"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Menu className="w-5 h-5" />
                <span>Homework</span>
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </Link>
            </li>
            <li>
              <Link
                href="/extension"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Chrome className="w-5 h-5" />
                <span>Chrome Extension</span>
              </Link>
            </li>
            <li>
              <Link
                href="/app"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Download className="w-5 h-5" />
                <span>Get the App</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Language Selector */}
        <div className="p-4 border-t">
          <select className="w-full p-2 border rounded-lg">
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {children}
    </div>
  );
}
