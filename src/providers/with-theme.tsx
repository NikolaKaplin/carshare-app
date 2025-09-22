import { ThemeProvider } from "@/contexts/ThemeContext";

export const withTheme = (component: () => React.ReactNode) => () => {
  return <ThemeProvider defaultTheme="system">{component()}</ThemeProvider>;
};
