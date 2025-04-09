import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-1 text-sm font-medium bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <Dashboard />
    </div>
  );
}
