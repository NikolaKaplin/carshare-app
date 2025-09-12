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
  Search,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Plus,
} from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { ICreatePayment, IPayment } from "@/types/payments-types";
import { usePayments } from "@/hooks/use-payments";
import { useBookings } from "@/hooks/use-bookings";
import { useClients } from "@/hooks/use-clients";

const statusColors = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200/50",
  completed: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
  failed: "bg-red-500/10 text-red-700 border-red-200/50",
  refunded: "bg-blue-500/10 text-blue-700 border-blue-200/50",
};

const statusLabels = {
  pending: "Ожидание",
  completed: "Завершен",
  failed: "Ошибка",
  refunded: "Возврат",
};

const paymentFields = [
  {
    key: "bookingId",
    label: "Бронирование",
    type: "select" as const,
    options: [], // будет заполнено динамически
  },
  {
    key: "userId",
    label: "Клиент",
    type: "select" as const,
    options: [], // будет заполнено динамически
  },
  { key: "amount", label: "Сумма (₽)", type: "number" as const },
  {
    key: "status",
    label: "Статус",
    type: "select" as const,
    options: [
      { value: "pending", label: "Ожидание" },
      { value: "completed", label: "Завершен" },
      { value: "failed", label: "Ошибка" },
      { value: "refunded", label: "Возврат" },
    ],
  },
  { key: "transactionId", label: "ID транзакции", type: "text" as const },
  {
    key: "cardLastDigits",
    label: "Последние цифры карты",
    type: "text" as const,
  },
  { key: "paymentDate", label: "Дата платежа", type: "date" as const },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [newPaymentData, setNewPaymentData] = useState<ICreatePayment>({
    bookingId: 0,
    userId: 0,
    amount: 0,
    status: "pending",
    transactionId: "",
    cardLastDigits: "",
    paymentDate: new Date(),
  });

  const {
    payments,
    isPaymentsLoading,
    createPayment,
    isCreatePaymentLoading,
    deletePayment,
    updatePayment,
    isUpdatePaymentLoading,
    isDeletePaymentLoading,
  } = usePayments(() => setIsAddDialogOpen(false));

  const { bookings } = useBookings(() => {});
  const { clients } = useClients(() => {});

  // Заполняем опции для выбора бронирования и клиента
  paymentFields[0].options =
    bookings?.map((booking) => ({
      value: booking.id.toString(),
      label: `Бронирование #${booking.id}`,
    })) || [];

  paymentFields[1].options =
    clients?.map((client) => ({
      value: client.id.toString(),
      label: `${client.fullName} (${client.email})`,
    })) || [];

  let filteredPayments: IPayment[] = [];
  let totalAmount = 0;
  let pendingPayments = 0;
  let completedPayments = 0;
  let failedPayments = 0;
  let refundedPayments = 0;

  if (payments) {
    filteredPayments = payments.filter((payment) => {
      const matchesSearch =
        payment.transactionId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.cardLastDigits?.includes(searchTerm) ||
        payment.amount.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    pendingPayments = payments.filter((p) => p.status === "pending").length;
    completedPayments = payments.filter((p) => p.status === "completed").length;
    failedPayments = payments.filter((p) => p.status === "failed").length;
    refundedPayments = payments.filter((p) => p.status === "refunded").length;
  }

  const getClientInfo = (userId: number) => {
    const client = clients?.find((c) => c.id === userId);
    return client
      ? `${client.fullName} (${client.email})`
      : "Неизвестный клиент";
  };

  const getBookingInfo = (bookingId: number) => {
    const booking = bookings?.find((b) => b.id === bookingId);
    return booking ? `Бронирование #${booking.id}` : "Неизвестное бронирование";
  };

  const handleAddPayment = () => {
    createPayment(newPaymentData);
    setNewPaymentData({
      bookingId: 0,
      userId: 0,
      amount: 0,
      status: "pending",
      transactionId: "",
      cardLastDigits: "",
      paymentDate: new Date(),
    });
  };

  const handleDeletePayment = () => {
    if (selectedPayment) {
      deletePayment(selectedPayment.id);
      setIsDrawerOpen(false);
      setSelectedPayment(null);
    }
  };

  const handleRowClick = (payment: IPayment) => {
    setSelectedPayment({ ...payment });
    setIsDrawerOpen(true);
  };

  const handleSavePayment = () => {
    if (selectedPayment) {
      updatePayment({
        id: selectedPayment.id,
        paymentData: {
          bookingId: selectedPayment.bookingId,
          userId: selectedPayment.userId,
          amount: selectedPayment.amount,
          status: selectedPayment.status,
          transactionId: selectedPayment.transactionId || "",
          cardLastDigits: selectedPayment.cardLastDigits || "",
          paymentDate: selectedPayment.paymentDate || new Date(),
        },
      });
      setIsDrawerOpen(false);
      setSelectedPayment(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedPayment(null);
      }, 150);
    }
  };

  if (isPaymentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных о платежах...
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
                Всего платежей
              </CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {payments?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общая сумма
              </CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalAmount.toLocaleString()} ₽
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
                {pendingPayments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Завершено
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {completedPayments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ошибки
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {failedPayments}
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
              Найдите нужный платеж
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по ID транзакции, сумме или карте..."
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
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="failed">Ошибка</SelectItem>
                  <SelectItem value="refunded">Возврат</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Payment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить платеж</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом платеже.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Бронирование</Label>
                  <Select
                    value={newPaymentData.bookingId.toString()}
                    onValueChange={(value) =>
                      setNewPaymentData({
                        ...newPaymentData,
                        bookingId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите бронирование" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookings?.map((booking) => (
                        <SelectItem
                          key={booking.id}
                          value={booking.id.toString()}
                        >
                          Бронирование #{booking.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">Клиент</Label>
                  <Select
                    value={newPaymentData.userId.toString()}
                    onValueChange={(value) =>
                      setNewPaymentData({
                        ...newPaymentData,
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
                          {client.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Сумма (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  value={newPaymentData.amount}
                  onChange={(e) =>
                    setNewPaymentData({
                      ...newPaymentData,
                      amount: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    value={newPaymentData.status}
                    onValueChange={(value: any) =>
                      setNewPaymentData({ ...newPaymentData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидание</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                      <SelectItem value="failed">Ошибка</SelectItem>
                      <SelectItem value="refunded">Возврат</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Дата платежа</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={
                      newPaymentData.paymentDate!.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setNewPaymentData({
                        ...newPaymentData,
                        paymentDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionId">ID транзакции</Label>
                  <Input
                    id="transactionId"
                    placeholder="txn_123456789"
                    value={newPaymentData.transactionId!}
                    onChange={(e) =>
                      setNewPaymentData({
                        ...newPaymentData,
                        transactionId: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardLastDigits">Последние цифры карты</Label>
                  <Input
                    id="cardLastDigits"
                    placeholder="1234"
                    value={newPaymentData.cardLastDigits!}
                    onChange={(e) =>
                      setNewPaymentData({
                        ...newPaymentData,
                        cardLastDigits: e.target.value,
                      })
                    }
                  />
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
                onClick={handleAddPayment}
                disabled={isCreatePaymentLoading}
              >
                {isCreatePaymentLoading ? "Добавление..." : "Добавить платеж"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                История платежей
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredPayments.length} платежей из{" "}
                {payments?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить платеж
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Бронирование</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Транзакция</TableHead>
                    <TableHead>Дата платежа</TableHead>
                    <TableHead>Дата создания</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment: IPayment) => (
                    <TableRow
                      key={payment.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(payment)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {getClientInfo(payment.userId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {getBookingInfo(payment.bookingId)}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {payment.amount.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>
                          {statusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {payment.transactionId || "Не указано"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate
                                ).toLocaleDateString("ru-RU")
                              : "Не указана"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "ru-RU"
                        )}
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
        entity={selectedPayment}
        onEntityChange={setSelectedPayment}
        onSave={handleSavePayment}
        onDelete={handleDeletePayment}
        isSaving={isUpdatePaymentLoading}
        isDeleting={isDeletePaymentLoading}
        title="Редактирование платежа"
        description="Измените данные платежа и нажмите 'Сохранить'"
        fields={paymentFields as any}
        additionalInfo={
          selectedPayment && (
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
                    {new Date(selectedPayment.createdAt).toLocaleDateString(
                      "ru-RU"
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID платежа
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedPayment.id}
                  </div>
                </div>
              </div>
              {selectedPayment.cardLastDigits && (
                <div className="mt-4 space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Данные карты
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    **** **** **** {selectedPayment.cardLastDigits}
                  </div>
                </div>
              )}
            </div>
          )
        }
      />
    </div>
  );
}
