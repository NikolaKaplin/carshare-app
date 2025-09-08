"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  CreditCard,
  Users,
  DollarSign,
  Receipt,
  AlertCircle,
} from "lucide-react";

// Mock data based on the payments schema
const mockPayments = [
  {
    id: "1",
    bookingId: "1",
    userId: "1",
    amount: 7500,
    status: "completed" as const,
    transactionId: "txn_1234567890",
    cardLastDigits: "4242",
    paymentDate: new Date("2024-12-08T14:30:00"),
    createdAt: new Date("2024-12-08T14:25:00"),
    // Related data
    booking: {
      startDate: new Date("2024-12-10T10:00:00"),
      endDate: new Date("2024-12-12T18:00:00"),
      totalDays: 3,
      car: { brand: "Toyota", model: "Camry", licensePlate: "А123БВ77" },
    },
    user: { fullName: "Иван Петров", email: "ivan.petrov@email.com" },
  },
  {
    id: "2",
    bookingId: "2",
    userId: "2",
    amount: 3000,
    status: "completed" as const,
    transactionId: "txn_2345678901",
    cardLastDigits: "1234",
    paymentDate: new Date("2024-12-13T16:45:00"),
    createdAt: new Date("2024-12-13T16:40:00"),
    booking: {
      startDate: new Date("2024-12-15T09:00:00"),
      endDate: new Date("2024-12-16T20:00:00"),
      totalDays: 2,
      car: { brand: "Hyundai", model: "Solaris", licensePlate: "В456ГД77" },
    },
    user: { fullName: "Мария Сидорова", email: "maria.sidorova@email.com" },
  },
  {
    id: "3",
    bookingId: "3",
    userId: "4",
    amount: 2400,
    status: "pending" as const,
    transactionId: null,
    cardLastDigits: null,
    paymentDate: null,
    createdAt: new Date("2024-12-18T10:15:00"),
    booking: {
      startDate: new Date("2024-12-20T14:00:00"),
      endDate: new Date("2024-12-22T12:00:00"),
      totalDays: 2,
      car: { brand: "Kia", model: "Rio", licensePlate: "И012КЛ77" },
    },
    user: { fullName: "Сергей Козлов", email: "sergey.kozlov@email.com" },
  },
  {
    id: "4",
    bookingId: "4",
    userId: "5",
    amount: 15000,
    status: "completed" as const,
    transactionId: "txn_3456789012",
    cardLastDigits: "5678",
    paymentDate: new Date("2024-11-23T12:20:00"),
    createdAt: new Date("2024-11-23T12:15:00"),
    booking: {
      startDate: new Date("2024-11-25T11:00:00"),
      endDate: new Date("2024-11-27T16:00:00"),
      totalDays: 3,
      car: {
        brand: "Mercedes-Benz",
        model: "E-Class",
        licensePlate: "М345НО77",
      },
    },
    user: { fullName: "Елена Волкова", email: "elena.volkova@email.com" },
  },
  {
    id: "5",
    bookingId: "5",
    userId: "1",
    amount: 18000,
    status: "refunded" as const,
    transactionId: "txn_4567890123",
    cardLastDigits: "4242",
    paymentDate: new Date("2024-12-20T09:30:00"),
    createdAt: new Date("2024-12-20T09:25:00"),
    booking: {
      startDate: new Date("2024-12-25T10:00:00"),
      endDate: new Date("2024-12-28T18:00:00"),
      totalDays: 4,
      car: { brand: "BMW", model: "X5", licensePlate: "Е789ЖЗ77" },
    },
    user: { fullName: "Иван Петров", email: "ivan.petrov@email.com" },
  },
  {
    id: "6",
    bookingId: "6",
    userId: "3",
    amount: 5500,
    status: "failed" as const,
    transactionId: "txn_5678901234",
    cardLastDigits: "9999",
    paymentDate: null,
    createdAt: new Date("2024-12-19T15:10:00"),
    booking: {
      startDate: new Date("2024-12-21T08:00:00"),
      endDate: new Date("2024-12-23T19:00:00"),
      totalDays: 3,
      car: { brand: "Volkswagen", model: "Polo", licensePlate: "Н678ПР77" },
    },
    user: { fullName: "Александр Админов", email: "alex.admin@company.com" },
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusLabels = {
  pending: "Ожидает",
  completed: "Завершен",
  failed: "Неудачный",
  refunded: "Возвращен",
};

export default function PaymentsPage() {
  const [payments, _setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking.car.brand
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.booking.car.model
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.booking.car.licensePlate
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.transactionId &&
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const now = new Date();
      const paymentDate = payment.paymentDate || payment.createdAt;
      if (dateFilter === "today") {
        matchesDate = paymentDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = paymentDate >= monthAgo;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPayments = payments.length;
  const completedPayments = payments.filter(
    (payment) => payment.status === "completed"
  ).length;
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending"
  ).length;
  const totalRevenue = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить новый платеж</DialogTitle>
              <DialogDescription>
                Заполните информацию для регистрации нового платежа.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="booking">Бронирование</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите бронирование" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      Иван Петров - Toyota Camry
                    </SelectItem>
                    <SelectItem value="2">
                      Мария Сидорова - Hyundai Solaris
                    </SelectItem>
                    <SelectItem value="3">Сергей Козлов - Kia Rio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма (₽)</Label>
                  <Input id="amount" type="number" placeholder="7500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                      <SelectItem value="failed">Неудачный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionId">ID транзакции</Label>
                  <Input id="transactionId" placeholder="txn_1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardLastDigits">
                    Последние 4 цифры карты
                  </Label>
                  <Input id="cardLastDigits" placeholder="4242" maxLength={4} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Дата платежа</Label>
                <Input id="paymentDate" type="datetime-local" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Добавить платеж
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className=" px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего платежей
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершенные</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedPayments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ожидают обработки
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingPayments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalRevenue.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Фильтры и поиск</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по клиенту, автомобилю, ID транзакции..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="failed">Неудачный</SelectItem>
                  <SelectItem value="refunded">Возвращен</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все время</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Список платежей</CardTitle>
            <CardDescription>
              Найдено {filteredPayments.length} платежей из {totalPayments}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Бронирование</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Способ оплаты</TableHead>
                    <TableHead>Дата платежа</TableHead>
                    <TableHead>ID транзакции</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {payment.user.fullName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {payment.booking.car.brand}{" "}
                            {payment.booking.car.model}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {payment.booking.car.licensePlate}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment.booking.startDate.toLocaleDateString(
                              "ru-RU"
                            )}{" "}
                            -{" "}
                            {payment.booking.endDate.toLocaleDateString(
                              "ru-RU"
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-lg">
                        {payment.amount.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>
                          {statusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.cardLastDigits ? (
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              •••• {payment.cardLastDigits}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Не указано
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? (
                          <div className="space-y-1">
                            <div className="text-sm">
                              {payment.paymentDate.toLocaleDateString("ru-RU")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payment.paymentDate.toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Не обработан</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.transactionId ? (
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {payment.transactionId}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Просмотр деталей
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Повторить платеж
                            </DropdownMenuItem>
                            <DropdownMenuItem>Возврат средств</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Отменить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
