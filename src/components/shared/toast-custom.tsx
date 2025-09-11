import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

class CustomToast {
  private readonly duration = 2000;
  private readonly position: Position = "top-center";

  // Базовые стили для адаптации под тему
  private getBaseStyles() {
    return {
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      borderRadius: "var(--radius)",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    };
  }

  success = (id: string, description?: string, style?: React.CSSProperties) =>
    toast.success(description, {
      id: id,
      description: description,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      duration: this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        borderColor: "hsl(var(--success-border))",
        backgroundColor: "hsl(var(--success-bg))",
        ...style,
      },
    });

  error = (id: string, description?: string, style?: React.CSSProperties) =>
    toast.error(description, {
      id: id,
      description: description,
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      duration: this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        borderColor: "hsl(var(--destructive-border))",
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
        ...style,
      },
    });

  info = (id: string, description?: string, style?: React.CSSProperties) =>
    toast(description, {
      id: id,
      description: description,
      icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
      duration: this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        borderColor: "hsl(var(--info-border))",
        backgroundColor: "hsl(var(--info-bg))",
        ...style,
      },
    });

  warning = (id: string, description?: string, style?: React.CSSProperties) =>
    toast.warning(description, {
      id: id,
      description: description,
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      duration: this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        borderColor: "hsl(var(--warning-border))",
        backgroundColor: "hsl(var(--warning-bg))",
        ...style,
      },
    });

  loading = (id: string, description?: string, style?: React.CSSProperties) =>
    toast.loading(description, {
      id: id,
      description: description,
      icon: <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />,
      duration: this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        borderColor: "hsl(var(--muted-border))",
        backgroundColor: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
        ...style,
      },
    });

  custom = (
    id: string,
    description?: string,
    options?: {
      icon?: React.ReactNode;
      style?: React.CSSProperties;
      duration?: number;
    }
  ) =>
    toast(description, {
      id: id,
      description: description,
      icon: options?.icon,
      duration: options?.duration || this.duration,
      position: this.position,
      style: {
        ...this.getBaseStyles(),
        ...options?.style,
      },
    });
}

export const customToast = new CustomToast();
