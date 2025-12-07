"use client";

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{
  theme: string | null;
  setTheme: (theme: "red" | "green" | "wood") => void;
}>({
  theme: "red",
  setTheme: (theme: "red" | "green" | "wood") => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<string | null>("red");
  const setTheme = (newTheme: "red" | "green" | "wood") => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
