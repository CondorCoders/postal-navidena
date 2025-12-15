"use client";

import { createContext, useContext, useState } from "react";
import { BackgroundThemeType } from "./backgroundTheme.types";

const ThemeContext = createContext<{
  theme: string | null;
  setTheme: (theme: "red" | "green" | "wood") => void;
  backgroundTheme: string | null;
  setBackgroundTheme: (theme: BackgroundThemeType) => void;
}>({
  theme: "red",
  setTheme: (theme: "red" | "green" | "wood") => {},
  backgroundTheme: "classic",
  setBackgroundTheme: (theme: BackgroundThemeType) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<string | null>("red");
  const [backgroundTheme, setBackgroundThemeState] = useState<string | null>(
    "classic"
  );

  const setTheme = (newTheme: "red" | "green" | "wood") => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };
  const setBackgroundTheme = (newTheme: BackgroundThemeType) => {
    setBackgroundThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-background-theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, backgroundTheme, setBackgroundTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
