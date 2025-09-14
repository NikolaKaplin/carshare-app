import { useTheme } from "@/contexts/ThemeContext";
import { Check } from "lucide-react";

const colorThemes = [
  { id: "zinc" as const, name: "Zinc", color: "theme-swatch-zinc" },
  { id: "red" as const, name: "Red", color: "theme-swatch-red" },
  { id: "rose" as const, name: "Rose", color: "theme-swatch-rose" },
  { id: "orange" as const, name: "Orange", color: "theme-swatch-orange" },
  { id: "green" as const, name: "Green", color: "theme-swatch-green" },
  { id: "blue" as const, name: "Blue", color: "theme-swatch-blue" },
  { id: "yellow" as const, name: "Yellow", color: "theme-swatch-yellow" },
  { id: "violet" as const, name: "Violet", color: "theme-swatch-violet" },
];

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div className="theme-color-grid">
      {colorThemes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setColorTheme(theme.id)}
          className={`theme-color-button ${theme.color}`}
          data-selected={colorTheme === theme.id ? "true" : undefined}
          title={theme.name}
          style={{
            backgroundColor: `oklch(var(--primary))`,
            borderColor:
              colorTheme === theme.id ? `oklch(var(--primary))` : undefined,
          }}
        >
          {colorTheme === theme.id && <Check className="theme-color-check" />}
        </button>
      ))}
    </div>
  );
}
