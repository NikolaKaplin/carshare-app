import { useAuthorized } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";

// Данные для графиков
const revenueData = [
  { month: "Янв", revenue: 450000 },
  { month: "Фев", revenue: 520000 },
  { month: "Мар", revenue: 480000 },
  { month: "Апр", revenue: 610000 },
  { month: "Май", revenue: 750000 },
  { month: "Июн", revenue: 890000 },
];

const carCategoryData = [
  { name: "Эконом", value: 45 },
  { name: "Комфорт", value: 30 },
  { name: "Бизнес", value: 15 },
  { name: "Премиум", value: 10 },
];

const bookingsData = [
  { day: "1", bookings: 12 },
  { day: "2", bookings: 19 },
  { day: "3", bookings: 15 },
  { day: "4", bookings: 22 },
  { day: "5", bookings: 18 },
  { day: "6", bookings: 25 },
  { day: "7", bookings: 30 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function DashboardPage() {
  const { user, logout } = useAuthorized();

  const stats = [
    {
      title: "Всего клиентов",
      value: "1,234",
      icon: Users,
      change: "+12%",
      description: "За месяц",
    },
    {
      title: "Автомобилей",
      value: "89",
      icon: Car,
      change: "+5%",
      description: "В парке",
    },
    {
      title: "Активных аренд",
      value: "42",
      icon: Calendar,
      change: "+8%",
      description: "Сейчас",
    },
    {
      title: "Выручка",
      value: "₽1,234K",
      icon: DollarSign,
      change: "+15%",
      description: "За месяц",
    },
    {
      title: "Средний рейтинг",
      value: "4.7",
      icon: Star,
      change: "+0.2",
      description: "Из 5.0",
    },
    {
      title: "Заполняемость",
      value: "78%",
      icon: TrendingUp,
      change: "+5%",
      description: "Парка",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель управления</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {user?.username}
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Выйти
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-green-600 font-medium">
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Графики */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* График выручки */}
        <Card>
          <CardHeader>
            <CardTitle>Выручка по месяцам</CardTitle>
            <CardDescription>
              Динамика доходов за последние 6 месяцев
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₽${value}`, "Выручка"]} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Распределение по категориям */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
            <CardDescription>
              Популярность категорий автомобилей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {carCategoryData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Доля"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Дополнительные графики */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Бронирования по дням */}
        <Card>
          <CardHeader>
            <CardTitle>Бронирования по дням</CardTitle>
            <CardDescription>
              Динамика бронирований за последнюю неделю
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Быстрый обзор */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрый обзор</CardTitle>
            <CardDescription>Ключевые показатели системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Новых клиентов
              </span>
              <span className="font-medium">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Средняя аренда
              </span>
              <span className="font-medium">3.2 дня</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Коэффициент использования
              </span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Отменено броней
              </span>
              <span className="font-medium text-red-600">5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Средний чек</span>
              <span className="font-medium">₽4,250</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Последние действия */}
      <Card>
        <CardHeader>
          <CardTitle>Последние действия</CardTitle>
          <CardDescription>Недавняя активность в системе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Новая аренда подтверждена</p>
                  <p className="text-sm text-muted-foreground">
                    Клиент: Иван Иванов • Hyundai Solaris
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 мин назад</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Оплата получена</p>
                  <p className="text-sm text-muted-foreground">
                    ₽15,000 • Бронирование #1234
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                10 мин назад
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">Автомобиль возвращен</p>
                  <p className="text-sm text-muted-foreground">
                    Kia Rio • Пробег: 23400 км
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 час назад</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
