import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RussianRubleIcon } from "lucide-react";
import { usePayments } from "@/hooks/use-payments";
import { useClients } from "@/hooks/use-clients";
import { useBookings } from "@/hooks/use-bookings";
import { useCars } from "@/hooks/use-cars";
import { useMemo } from "react";

export function SectionCards() {
  const { payments } = usePayments();
  const { clients } = useClients();
  const { bookings } = useBookings();
  const { cars } = useCars();

  const stats = useMemo(() => {
    if (!payments || !clients || !bookings || !cars) return null;

    // Общий доход (только завершенные платежи)
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Новые клиенты за последний месяц
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newClients = clients.filter(
      (client) => new Date(client.createdAt) > oneMonthAgo
    ).length;

    // Активные бронирования (сейчас)
    const activeBookings = bookings.filter(
      (booking) => booking.status === "active" || booking.status === "confirmed"
    ).length;

    // Доступные автомобили
    const availableCars = cars.filter(
      (car) => car.status === "available"
    ).length;

    // Процент роста дохода за последний месяц
    const lastMonthRevenue = payments
      .filter(
        (p) =>
          p.status === "completed" &&
          new Date(p.paymentDate || p.createdAt) > oneMonthAgo
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

    const previousMonthRevenue = totalRevenue - lastMonthRevenue;
    const revenueGrowth =
      previousMonthRevenue > 0
        ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
          100
        : 0;

    // Процент роста клиентов
    const totalClients = clients.length;
    const previousMonthClients = totalClients - newClients;
    const clientGrowth =
      previousMonthClients > 0
        ? ((newClients - previousMonthClients) / previousMonthClients) * 100
        : 0;

    // Процент доступных автомобилей
    const carUtilization =
      cars.length > 0 ? (availableCars / cars.length) * 100 : 0;

    return {
      totalRevenue,
      newClients,
      activeBookings,
      carUtilization,
      revenueGrowth,
      clientGrowth,
      totalClients,
      availableCars,
      totalCars: cars.length,
    };
  }, [payments, clients, bookings, cars]);

  if (!stats) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>Загрузка...</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                ...
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Общий доход */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Общий доход</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center">
            {Math.round(stats.totalRevenue / 1000)} тыс.{" "}
            <RussianRubleIcon className="ml-1 h-4 w-4" />
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {stats.revenueGrowth >= 0 ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {Math.abs(stats.revenueGrowth).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.revenueGrowth >= 0 ? "Рост" : "Падение"} в этом месяце
            {stats.revenueGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Доход от завершенных платежей
          </div>
        </CardFooter>
      </Card>

      {/* Новые клиенты */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Новые клиенты</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.newClients}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.clientGrowth >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {stats.clientGrowth >= 0 ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {Math.abs(stats.clientGrowth).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.clientGrowth >= 0 ? "Рост" : "Падение"} за месяц
            {stats.clientGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Всего клиентов: {stats.totalClients}
          </div>
        </CardFooter>
      </Card>

      {/* Активные бронирования */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Активные бронирования</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeBookings}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <IconTrendingUp className="h-3 w-3" />
              {bookings?.length || 0} всего
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Текущая активность <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Подтвержденные и активные аренды
          </div>
        </CardFooter>
      </Card>

      {/* Доступные автомобили */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Доступные автомобили</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.availableCars}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="h-3 w-3" />
              {stats.carUtilization.toFixed(0)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Уровень доступности <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Всего автомобилей: {stats.totalCars}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
