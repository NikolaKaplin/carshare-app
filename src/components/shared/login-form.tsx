import { useState, useEffect } from "react";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

import { useAuthorized } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { useDatabase } from "tauri-react-sqlite";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { db } = useDatabase();
  const { login } = useAuthorized();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Проверяем есть ли пользователи в базе
  useEffect(() => {
    const checkUsers = async () => {
      if (!db) return;

      try {
        const userCount = await db.select().from(users as any);
        setHasUsers(userCount.length > 0);
      } catch (err) {
        console.error("Error checking users:", err);
        setHasUsers(false);
      }
    };

    checkUsers();
  }, [db]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!db) {
      setError("База данных недоступна");
      setIsLoading(false);
      return;
    }

    try {
      const result = await db
        .select()
        .from(users as any)
        .where(eq(users.email, loginData.email) as any)
        .limit(1);

      if (result.length === 0) {
        setError("Пользователь с таким email не найден");
        setIsLoading(false);
        return;
      }

      const user = result[0];

      const isPasswordValid = await compare(
        loginData.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        setError("Неверный пароль");
        setIsLoading(false);
        return;
      }

      login(user as any);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка при входе в систему");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!db) {
      setError("База данных недоступна");
      setIsLoading(false);
      return;
    }

    // Валидация
    if (adminData.password !== adminData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (adminData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      // Проверяем нет ли уже пользователей
      const existingUsers = await db.select().from(users as any);
      if (existingUsers.length > 0) {
        setError("Администратор уже создан");
        setIsLoading(false);
        return;
      }

      // Хэшируем пароль
      const hashedPassword = await hash(adminData.password, 12);

      // Создаем администратора
      await db.insert(users as any).values({
        username: adminData.username,
        email: adminData.email,
        passwordHash: hashedPassword,
      });

      // Автоматически логиним
      login({
        username: adminData.username,
        email: adminData.email,
      });
      navigate("/");
    } catch (err) {
      console.error("Create admin error:", err);
      setError("Ошибка при создании администратора");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  if (hasUsers === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка системы...</p>
        </div>
      </div>
    );
  }

  // Если пользователей нет - показываем только форму создания админа
  if (!hasUsers) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-light">
              Создание администратора
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Задайте учетные данные для первого входа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-sm font-medium">
                  Имя пользователя
                </Label>
                <Input
                  id="admin-username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  value={adminData.username}
                  onChange={handleAdminInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={adminData.email}
                  onChange={handleAdminInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  Пароль
                </Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={adminData.password}
                  onChange={handleAdminInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="admin-confirm-password"
                  className="text-sm font-medium"
                >
                  Подтверждение пароля
                </Label>
                <Input
                  id="admin-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  value={adminData.confirmPassword}
                  onChange={handleAdminInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Создание...
                  </>
                ) : (
                  "Создать администратора"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Если пользователи есть - показываем форму входа
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-light">Вход в систему</CardTitle>
          <CardDescription className="text-muted-foreground">
            Войдите в панель управления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={loginData.email}
                onChange={handleLoginInputChange}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Пароль
              </Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
