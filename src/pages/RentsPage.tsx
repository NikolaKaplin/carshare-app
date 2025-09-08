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
import { Textarea } from "@/components/ui/textarea";
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
  Wrench,
  Car,
  Calendar,
  DollarSign,
  Gauge,
} from "lucide-react";

// Mock data based on the maintenance schema
const mockMaintenance = [
  {
    id: "1",
    carId: "1",
    description: "Замена масла и масляного фильтра",
    cost: 3500,
    date: new Date("2024-12-01T10:00:00"),
    mileage: 15000,
    createdAt: new Date("2024-12-01T09:30:00"),
    // Related data
    car: {
      brand: "Toyota",
      model: "Camry",
      licensePlate: "А123БВ77",
      color: "Белый",
    },
  },
  {
    id: "2",
    carId: "2",
    description: "Замена тормозных колодок передних",
    cost: 8500,
    date: new Date("2024-11-28T14:30:00"),
    mileage: 32000,
    createdAt: new Date("2024-11-28T14:00:00"),
    car: {
      brand: "Hyundai",
      model: "Solaris",
      licensePlate: "В456ГД77",
      color: "Серый",
    },
  },
  {
    id: "3",
    carId: "3",
    description: "Диагностика двигателя, замена свечей зажигания",
    cost: 12000,
    date: new Date("2024-12-05T11:15:00"),
    mileage: 8500,
    createdAt: new Date("2024-12-05T10:45:00"),
    car: {
      brand: "BMW",
      model: "X5",
      licensePlate: "Е789ЖЗ77",
      color: "Черный",
    },
  },
  {
    id: "4",
    carId: "4",
    description: "Плановое ТО-2: замена фильтров, жидкостей",
    cost: 15000,
    date: new Date("2024-11-25T09:00:00"),
    mileage: 45000,
    createdAt: new Date("2024-11-25T08:30:00"),
    car: {
      brand: "Kia",
      model: "Rio",
      licensePlate: "И012КЛ77",
      color: "Красный",
    },
  },
  {
    id: "5",
    carId: "5",
    description: "Замена летних шин на зимние",
    cost: 4500,
    date: new Date("2024-11-20T16:00:00"),
    mileage: 12000,
    createdAt: new Date("2024-11-20T15:30:00"),
    car: {
      brand: "Mercedes-Benz",
      model: "E-Class",
      licensePlate: "М345НО77",
      color: "Синий",
    },
  },
  {
    id: "6",
    carId: "1",
    description: "Ремонт кондиционера, заправка фреоном",
    cost: 7800,
    date: new Date("2024-10-15T13:20:00"),
    mileage: 14500,
    createdAt: new Date("2024-10-15T12:50:00"),
    car: {
      brand: "Toyota",
      model: "Camry",
      licensePlate: "А123БВ77",
      color: "Белый",
    },
  },
];

const maintenanceTypes = {
  routine: {
    label: "Плановое ТО",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  repair: { label: "Ремонт", color: "bg-red-100 text-red-800 border-red-200" },
  seasonal: {
    label: "Сезонное",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  emergency: {
    label: "Экстренное",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

function getMaintenanceType(description: string) {
  const desc = description.toLowerCase();
  if (desc.includes("плановое") || desc.includes("то-")) return "routine";
  if (desc.includes("замена шин") || desc.includes("сезон")) return "seasonal";
  if (desc.includes("ремонт") || desc.includes("диагностика")) return "repair";
  return "routine";
}

export default function RentsPage() {
  const [maintenance, _setMaintenance] = useState(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");
  const [carFilter, setCarFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredMaintenance = maintenance.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCar = carFilter === "all" || item.carId === carFilter;
    const matchesType =
      typeFilter === "all" ||
      getMaintenanceType(item.description) === typeFilter;

    return matchesSearch && matchesCar && matchesType;
  });

  const totalMaintenance = maintenance.length;
  const totalCost = maintenance.reduce((sum, item) => sum + item.cost, 0);
  const averageCost =
    totalMaintenance > 0 ? Math.round(totalCost / totalMaintenance) : 0;
  const thisMonthMaintenance = maintenance.filter((item) => {
    const now = new Date();
    const itemDate = item.date;
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Get unique cars for filter
  const uniqueCars = Array.from(
    new Map(maintenance.map((item) => [item.carId, item.car])).values()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить запись об обслуживании</DialogTitle>
              <DialogDescription>
                Заполните информацию о проведенном техническом обслуживании.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="car">Автомобиль</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите автомобиль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Toyota Camry (А123БВ77)</SelectItem>
                    <SelectItem value="2">
                      Hyundai Solaris (В456ГД77)
                    </SelectItem>
                    <SelectItem value="3">BMW X5 (Е789ЖЗ77)</SelectItem>
                    <SelectItem value="4">Kia Rio (И012КЛ77)</SelectItem>
                    <SelectItem value="5">
                      Mercedes-Benz E-Class (М345НО77)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание работ</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание выполненных работ..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Стоимость (₽)</Label>
                  <Input id="cost" type="number" placeholder="3500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Пробег (км)</Label>
                  <Input id="mileage" type="number" placeholder="15000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Дата проведения</Label>
                <Input id="date" type="datetime-local" />
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
                Добавить запись
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
                Всего записей
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaintenance}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                За этот месяц
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {thisMonthMaintenance}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Общие затраты
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalCost.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Средняя стоимость
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {averageCost.toLocaleString()} ₽
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
                    placeholder="Поиск по описанию, автомобилю, номеру..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={carFilter} onValueChange={setCarFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Автомобиль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все автомобили</SelectItem>
                  {uniqueCars.map((car, index) => (
                    <SelectItem
                      key={index}
                      value={
                        maintenance.find((m) => m.car === car)?.carId || ""
                      }
                    >
                      {car.brand} {car.model} ({car.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Тип работ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="routine">Плановое ТО</SelectItem>
                  <SelectItem value="repair">Ремонт</SelectItem>
                  <SelectItem value="seasonal">Сезонное</SelectItem>
                  <SelectItem value="emergency">Экстренное</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">История обслуживания</CardTitle>
            <CardDescription>
              Найдено {filteredMaintenance.length} записей из {totalMaintenance}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Описание работ</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Пробег</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenance.map((item) => {
                    const type = getMaintenanceType(item.description);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                              <Car className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.car.brand} {item.car.model}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.car.licensePlate} • {item.car.color}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <p className="text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={maintenanceTypes[type].color}>
                            {maintenanceTypes[type].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {item.date.toLocaleDateString("ru-RU")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.date.toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {item.mileage.toLocaleString()} км
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-lg">
                          {item.cost.toLocaleString()} ₽
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem>
                                Просмотр деталей
                              </DropdownMenuItem>
                              <DropdownMenuItem>Добавить фото</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
