import { ThemeProvider } from "@/contexts/ThemeContext";

export const withTheme = (component: () => React.ReactNode) => () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {component()}
    </ThemeProvider>
  );
};
