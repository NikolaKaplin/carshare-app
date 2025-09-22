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
import { Search, AlertTriangle, CheckCircle, XCircle, Plus, Calendar, User, Car } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { TNewHijacking, THijacking } from "../db/schema";
import { useHijacking } from "../hooks/use-hijacking";
import { useClients } from "../hooks/use-clients";
import { useCars } from "../hooks/use-cars";

const statusColors = {
  open: "bg-red-500/10 text-red-700 border-red-200/50",
  closed: "bg-green-500/10 text-green-700 border-green-200/50",
};

const statusLabels = {
  open: "Открыто",
  closed: "Закрыто",
};

const hijackingFields = [
  {
    key: "description",
    label: "Описание инцидента",
    type: "textarea" as const,
    placeholder: "Подробное описание угона или ДТП"
  },
  {
    key: "closed",
    label: "Статус",
    type: "select" as const,
    options: [
      { value: "false", label: "Открыто" },
      { value: "true", label: "Закрыто" },
    ]
  },
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
];

export default function HijackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedHijacking, setSelectedHijacking] = useState<THijacking | null>(null);
  const [newHijackingData, setNewHijackingData] = useState<TNewHijacking>({
    description: "",
    closed: false,
    userId: 0,
    carId: 0,
  });

  const {
    hijackings,
    isHijackingsLoading,
    createHijacking,
    isCreateHijackingLoading,
    deleteHijacking,
    updateHijacking,
    isUpdateHijackingLoading,
    isDeleteHijackingLoading,
  } = useHijacking(() => setIsAddDialogOpen(false));

  const { clients } = useClients(() => {});
  const { cars } = useCars(() => {});

  // Заполняем опции для выбора клиента и автомобиля
  hijackingFields[2].options =
    clients?.map((client) => ({
      value: client.id.toString(),
      label: `${client.fullName} (${client.email})`,
    })) || [];

  hijackingFields[3].options =
    cars?.map((car) => ({
      value: car.id.toString(),
      label: `${car.brand} ${car.model} (${car.licensePlate})`,
    })) || [];

  let filteredHijackings: THijacking[] = [];
  let openCases = 0;
  let closedCases = 0;
  let totalCases = 0;

  if (hijackings) {
    filteredHijackings = hijackings.filter((hijacking: THijacking) => {
      const matchesSearch = hijacking.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || 
        (statusFilter === "open" && !hijacking.closed) ||
        (statusFilter === "closed" && hijacking.closed);

      return matchesSearch && matchesStatus;
    });

    openCases = hijackings.filter(h => !h.closed).length;
    closedCases = hijackings.filter(h => h.closed).length;
    totalCases = hijackings.length;
  }

  const getClientInfo = (userId: number) => {
    const client = clients?.find((c) => c.id === userId);
    return client
      ? `${client.fullName} (${client.email})`
      : "Неизвестный клиент";
  };

  const getCarInfo = (carId: number) => {
    const car = cars?.find((c) => c.id === carId);
    return car
      ? `${car.brand} ${car.model} (${car.licensePlate})`
      : "Неизвестный автомобиль";
  };

  const handleAddHijacking = () => {
    createHijacking(newHijackingData);
    setNewHijackingData({
      description: "",
      closed: false,
      userId: 0,
      carId: 0,
    });
  };

  const handleDeleteHijacking = () => {
    if (selectedHijacking) {
      deleteHijacking(selectedHijacking.id);
      setIsDrawerOpen(false);
      setSelectedHijacking(null);
    }
  };

  const handleRowClick = (hijacking: THijacking) => {
    setSelectedHijacking({ ...hijacking });
    setIsDrawerOpen(true);
  };

  const handleSaveHijacking = () => {
    if (selectedHijacking) {
      updateHijacking({
        id: selectedHijacking.id,
        hijacking: {
          description: selectedHijacking.description,
          closed: selectedHijacking.closed,
          userId: selectedHijacking.userId,
          carId: selectedHijacking.carId,
        },
      });
      setIsDrawerOpen(false);
      setSelectedHijacking(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedHijacking(null);
      }, 150);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isHijackingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных об угонах и ДТП...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего инцидентов
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalCases}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Открытые дела
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {openCases}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Закрытые дела
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {closedCases}
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
              Найдите нужный инцидент
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус дела" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="open">Открытые</SelectItem>
                  <SelectItem value="closed">Закрытые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Hijacking Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Создать новую запись об инциденте</DialogTitle>
              <DialogDescription>
                Заполните информацию об угоне или ДТП.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Клиент</Label>
                <Select
                  value={newHijackingData.userId.toString()}
                  onValueChange={(value) =>
                    setNewHijackingData({
                      ...newHijackingData,
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
                  value={newHijackingData.carId.toString()}
                  onValueChange={(value) =>
                    setNewHijackingData({
                      ...newHijackingData,
                      carId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите автомобиль" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars?.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.brand} {car.model} ({car.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание инцидента</Label>
                <textarea
                  id="description"
                  placeholder="Подробное описание угона или ДТП..."
                  value={newHijackingData.description}
                  onChange={(e) =>
                    setNewHijackingData({
                      ...newHijackingData,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closed">Статус дела</Label>
                <Select
                  value={newHijackingData.closed?.toString()}
                  onValueChange={(value) =>
                    setNewHijackingData({
                      ...newHijackingData,
                      closed: value === "true",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Открыто</SelectItem>
                    <SelectItem value="true">Закрыто</SelectItem>
                  </SelectContent>
                </Select>
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
                onClick={handleAddHijacking}
                disabled={isCreateHijackingLoading}
              >
                {isCreateHijackingLoading
                  ? "Создание..."
                  : "Создать запись"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список инцидентов (угоны и ДТП)
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredHijackings.length} инцидентов из {hijackings?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать запись
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHijackings.map((hijacking: THijacking) => (
                    <TableRow
                      key={hijacking.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(hijacking)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            #{hijacking.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {getClientInfo(hijacking.userId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {getCarInfo(hijacking.carId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground line-clamp-2">
                          {hijacking.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {formatDate(hijacking.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={hijacking.closed ? statusColors.closed : statusColors.open}>
                          {hijacking.closed ? statusLabels.closed : statusLabels.open}
                        </Badge>
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
        entity={selectedHijacking}
        onEntityChange={setSelectedHijacking}
        onSave={handleSaveHijacking}
        onDelete={handleDeleteHijacking}
        isSaving={isUpdateHijackingLoading}
        isDeleting={isDeleteHijackingLoading}
        title="Редактирование записи об инциденте"
        description="Измените данные об угоне/ДТП и нажмите 'Сохранить'"
        fields={hijackingFields as any}
        additionalInfo={
          selectedHijacking && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID инцидента
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedHijacking.id}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата создания
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(selectedHijacking.createdAt)}
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