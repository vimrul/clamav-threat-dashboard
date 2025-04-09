import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border text-sm font-medium
               transition duration-300
               bg-white dark:bg-gray-800
               text-black dark:text-white
               border-gray-300 dark:border-gray-600 cursor-pointer"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
