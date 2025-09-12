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
import { Search, Calendar, Car, User, DollarSign, Plus } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { ICreateBooking, IBooking } from "@/types/bookings-types";
import { useBookings } from "@/hooks/use-bookings";
import { useCars } from "@/hooks/use-cars";
import { useClients } from "@/hooks/use-clients";

const statusColors = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200/50",
  confirmed: "bg-blue-500/10 text-blue-700 border-blue-200/50",
  active: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
  completed: "bg-gray-500/10 text-gray-700 border-gray-200/50",
  cancelled: "bg-red-500/10 text-red-700 border-red-200/50",
};

const statusLabels = {
  pending: "Ожидание",
  confirmed: "Подтверждено",
  active: "Активно",
  completed: "Завершено",
  cancelled: "Отменено",
};

const paymentStatusLabels = {
  pending: "Ожидание",
  paid: "Оплачено",
  refunded: "Возврат",
};

const bookingFields = [
  {
    key: "userId",
    label: "Клиент",
    type: "select" as const,
    options: [], // будет заполнено динамически
  },
  {
    key: "carId",
    label: "Автомобиль",
    type: "select" as const,
    options: [], // будет заполнено динамически
  },
  { key: "startDate", label: "Дата начала", type: "date" as const },
  { key: "endDate", label: "Дата окончания", type: "date" as const },
  { key: "totalDays", label: "Количество дней", type: "number" as const },
  { key: "totalPrice", label: "Общая стоимость (₽)", type: "number" as const },
  { key: "pickupLocation", label: "Место получения", type: "text" as const },
  {
    key: "status",
    label: "Статус",
    type: "select" as const,
    options: [
      { value: "pending", label: "Ожидание" },
      { value: "confirmed", label: "Подтверждено" },
      { value: "active", label: "Активно" },
      { value: "completed", label: "Завершено" },
      { value: "cancelled", label: "Отменено" },
    ],
  },
  {
    key: "paymentStatus",
    label: "Статус оплаты",
    type: "select" as const,
    options: [
      { value: "pending", label: "Ожидание" },
      { value: "paid", label: "Оплачено" },
      { value: "refunded", label: "Возврат" },
    ],
  },
];

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [newBookingData, setNewBookingData] = useState<ICreateBooking>({
    userId: 0,
    carId: 0,
    startDate: new Date(),
    endDate: new Date(),
    totalDays: 1,
    totalPrice: 0,
    pickupLocation: "",
    status: "pending",
    paymentStatus: "pending",
  });

  const {
    bookings,
    isBookingsLoading,
    createBooking,
    isCreateBookingLoading,
    deleteBooking,
    updateBooking,
    isUpdateBookingLoading,
    isDeleteBookingLoading,
  } = useBookings(() => setIsAddDialogOpen(false));

  const { cars } = useCars(() => {});
  const { clients } = useClients(() => {});

  // Заполняем опции для выбора автомобиля и клиента
  bookingFields[0].options =
    clients?.map((client) => ({
      value: client.id.toString(),
      label: `${client.fullName} (${client.email})`,
    })) || [];

  bookingFields[1].options =
    cars?.map((car) => ({
      value: car.id.toString(),
      label: `${car.brand} ${car.model} (${car.licensePlate}) - ${car.dailyPrice}₽/день`,
    })) || [];

  let filteredBookings: IBooking[] = [];
  let pendingBookings = 0;
  let confirmedBookings = 0;
  let activeBookings = 0;
  //@ts-ignore
  let completedBookings = 0;
  //@ts-ignore
  let cancelledBookings = 0;
  let totalRevenue = 0;

  if (bookings) {
    filteredBookings = bookings.filter(
      (booking: {
        pickupLocation: string;
        status: string;
        paymentStatus: string;
      }) => {
        const matchesSearch = booking.pickupLocation
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || booking.status === statusFilter;

        const matchesPaymentStatus =
          paymentStatusFilter === "all" ||
          booking.paymentStatus === paymentStatusFilter;

        return matchesSearch && matchesStatus && matchesPaymentStatus;
      }
    );

    pendingBookings = bookings.filter((b) => b.status === "pending").length;
    confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
    activeBookings = bookings.filter((b) => b.status === "active").length;
    completedBookings = bookings.filter((b) => b.status === "completed").length;
    cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;

    totalRevenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  const getCarInfo = (carId: number) => {
    const car = cars?.find((c) => c.id === carId);
    return car
      ? `${car.brand} ${car.model} (${car.licensePlate})`
      : "Неизвестный автомобиль";
  };

  const getClientInfo = (userId: number) => {
    const client = clients?.find((c) => c.id === userId);
    return client
      ? `${client.fullName} (${client.email})`
      : "Неизвестный клиент";
  };

  const calculatePrice = (carId: number, days: number) => {
    const car = cars?.find((c) => c.id === carId);
    return car ? car.dailyPrice * days : 0;
  };

  const handleAddBooking = () => {
    createBooking(newBookingData);
    setNewBookingData({
      userId: 0,
      carId: 0,
      startDate: new Date(),
      endDate: new Date(),
      totalDays: 1,
      totalPrice: 0,
      pickupLocation: "",
      status: "pending",
      paymentStatus: "pending",
    });
  };

  const handleDeleteBooking = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking.id);
      setIsDrawerOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleRowClick = (booking: IBooking) => {
    setSelectedBooking({ ...booking });
    setIsDrawerOpen(true);
  };

  const handleSaveBooking = () => {
    if (selectedBooking) {
      updateBooking({
        id: selectedBooking.id,
        booking: {
          userId: selectedBooking.userId,
          carId: selectedBooking.carId,
          startDate: selectedBooking.startDate,
          endDate: selectedBooking.endDate,
          totalDays: selectedBooking.totalDays,
          totalPrice: selectedBooking.totalPrice,
          pickupLocation: selectedBooking.pickupLocation,
          status: selectedBooking.status,
          paymentStatus: selectedBooking.paymentStatus,
        },
      });
      setIsDrawerOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedBooking(null);
      }, 150);
    }
  };

  const handleCarChange = (carId: number) => {
    const days = newBookingData.totalDays;
    const price = calculatePrice(carId, days);
    setNewBookingData({
      ...newBookingData,
      carId,
      totalPrice: price,
    });
  };

  const handleDaysChange = (days: number) => {
    const price = calculatePrice(newBookingData.carId, days);
    setNewBookingData({
      ...newBookingData,
      totalDays: days,
      totalPrice: price,
    });
  };

  if (isBookingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных о бронированиях...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего бронирований
              </CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {bookings?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Активные
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {activeBookings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Подтвержденные
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {confirmedBookings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ожидание
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {pendingBookings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общий доход
              </CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(totalRevenue / 1000)} тыс.₽
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Фильтры и поиск
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Найдите нужное бронирование
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по месту получения..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус бронирования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentStatusFilter}
                onValueChange={setPaymentStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="paid">Оплачено</SelectItem>
                  <SelectItem value="refunded">Возврат</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Booking Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Создать новое бронирование</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом бронировании автомобиля.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Клиент</Label>
                  <Select
                    value={newBookingData.userId.toString()}
                    onValueChange={(value) =>
                      setNewBookingData({
                        ...newBookingData,
                        userId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите клиента" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={client.id.toString()}
                        >
                          {client.fullName} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carId">Автомобиль</Label>
                  <Select
                    value={newBookingData.carId.toString()}
                    onValueChange={(value) => handleCarChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите автомобиль" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars
                        ?.filter((car) => car.status === "available")
                        .map((car) => (
                          <SelectItem key={car.id} value={car.id.toString()}>
                            {car.brand} {car.model} ({car.licensePlate}) -{" "}
                            {car.dailyPrice}₽/день
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Дата начала</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBookingData.startDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        startDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Дата окончания</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newBookingData.endDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const endDate = new Date(e.target.value);
                      const startDate = newBookingData.startDate;
                      const days = Math.ceil(
                        (endDate.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      handleDaysChange(days > 0 ? days : 1);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalDays">Количество дней</Label>
                  <Input
                    id="totalDays"
                    type="number"
                    min="1"
                    value={newBookingData.totalDays}
                    onChange={(e) =>
                      handleDaysChange(Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Общая стоимость</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    value={newBookingData.totalPrice}
                    disabled
                    className="font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Место получения</Label>
                <Input
                  id="pickupLocation"
                  placeholder="Москва, ул. Тверская, 1"
                  value={newBookingData.pickupLocation}
                  onChange={(e) =>
                    setNewBookingData({
                      ...newBookingData,
                      pickupLocation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Статус бронирования</Label>
                  <Select
                    value={newBookingData.status}
                    onValueChange={(value: any) =>
                      setNewBookingData({ ...newBookingData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидание</SelectItem>
                      <SelectItem value="confirmed">Подтверждено</SelectItem>
                      <SelectItem value="active">Активно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Статус оплаты</Label>
                  <Select
                    value={newBookingData.paymentStatus}
                    onValueChange={(value: any) =>
                      setNewBookingData({
                        ...newBookingData,
                        paymentStatus: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидание</SelectItem>
                      <SelectItem value="paid">Оплачено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleAddBooking}
                disabled={isCreateBookingLoading}
              >
                {isCreateBookingLoading
                  ? "Создание..."
                  : "Создать бронирование"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список бронирований
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredBookings.length} бронирований из{" "}
                {bookings?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать бронирование
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Период</TableHead>
                    <TableHead>Дни</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Оплата</TableHead>
                    <TableHead>Место получения</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking: IBooking) => (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(booking)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {getClientInfo(booking.userId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {getCarInfo(booking.carId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {new Date(booking.startDate).toLocaleDateString(
                              "ru-RU"
                            )}{" "}
                            -{" "}
                            {new Date(booking.endDate).toLocaleDateString(
                              "ru-RU"
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-foreground">
                        {booking.totalDays}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {booking.totalPrice.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.paymentStatus === "paid"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {paymentStatusLabels[booking.paymentStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {booking.pickupLocation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <EntityDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleCloseDrawer}
        entity={selectedBooking}
        onEntityChange={setSelectedBooking}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
        isSaving={isUpdateBookingLoading}
        isDeleting={isDeleteBookingLoading}
        title="Редактирование бронирования"
        description="Измените данные бронирования и нажмите 'Сохранить'"
        fields={bookingFields as any}
        additionalInfo={
          selectedBooking && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата создания
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {new Date(selectedBooking.createdAt).toLocaleDateString(
                      "ru-RU"
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID бронирования
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedBooking.id}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
