import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { colorTheme } = useTheme();

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground">
      <h3 className="text-lg font-semibold mb-3">Предпросмотр темы</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span className="text-sm">Основной цвет</span>
        </div>

        <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
          Кнопка
        </button>

        <div className="p-2 rounded-md border text-sm">Карточка с текстом</div>

        <div className="h-2 rounded-full bg-muted"></div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Текущая тема: {colorTheme}
      </p>
    </div>
  );
}
