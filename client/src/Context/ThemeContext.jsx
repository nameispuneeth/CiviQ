// // ThemeContext.jsx
// import { createContext, useState } from "react";

// // 1. Create a Context
// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // 2. Create a state for theme
//   const [isDark, setIsDark] = useState(false);

//   // 3. Function to toggle theme
//   const toggleTheme = () => setIsDark(prev => !prev);

//   // 4. Provide the state and toggle function to children
//   return (
//     <ThemeContext.Provider value={{ isDark, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
// ThemeContext.jsx
import { createContext, useState, useEffect } from "react";

// 1. Create a Context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 2. Create a state for theme
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDark(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 3. Function to toggle theme
  const toggleTheme = () => setIsDark(prev => !prev);

  // 4. Provide the state and toggle function to children
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};