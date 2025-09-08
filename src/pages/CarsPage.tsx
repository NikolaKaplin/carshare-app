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
import { Search, MoreHorizontal, Car, MapPin, Gauge } from "lucide-react";

const mockCars = [
  {
    id: "1",
    licensePlate: "А123БВ77",
    brand: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Белый",
    category: "business" as const,
    dailyPrice: 2500,
    isAvailable: true,
    currentMileage: 15000,
    status: "available" as const,
    location: "Москва, ул. Тверская, 1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    licensePlate: "В456ГД77",
    brand: "Hyundai",
    model: "Solaris",
    year: 2021,
    color: "Серый",
    category: "economy" as const,
    dailyPrice: 1500,
    isAvailable: false,
    currentMileage: 32000,
    status: "rented" as const,
    location: "Москва, ул. Арбат, 15",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    licensePlate: "Е789ЖЗ77",
    brand: "BMW",
    model: "X5",
    year: 2023,
    color: "Черный",
    category: "business" as const,
    dailyPrice: 4500,
    isAvailable: false,
    currentMileage: 8500,
    status: "maintenance" as const,
    location: "Москва, Кутузовский пр-т, 12",
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    licensePlate: "И012КЛ77",
    brand: "Kia",
    model: "Rio",
    year: 2020,
    color: "Красный",
    category: "economy" as const,
    dailyPrice: 1200,
    isAvailable: true,
    currentMileage: 45000,
    status: "available" as const,
    location: "Москва, ул. Новый Арбат, 24",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    licensePlate: "М345НО77",
    brand: "Mercedes-Benz",
    model: "E-Class",
    year: 2023,
    color: "Синий",
    category: "business" as const,
    dailyPrice: 5000,
    isAvailable: true,
    currentMileage: 12000,
    status: "available" as const,
    location: "Москва, ул. Остоженка, 7",
    createdAt: new Date("2024-02-28"),
  },
];

const statusColors = {
  available: "bg-green-100 text-green-800 border-green-200",
  rented: "bg-blue-100 text-blue-800 border-blue-200",
  maintenance: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusLabels = {
  available: "Доступен",
  rented: "Арендован",
  maintenance: "Обслуживание",
};

const categoryLabels = {
  economy: "Эконом",
  comfort: "Комфорт",
  business: "Бизнес",
};

export default function CarsPage() {
  const [cars, _setCars] = useState(mockCars);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || car.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || car.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const availableCars = cars.filter((car) => car.status === "available").length;
  const rentedCars = cars.filter((car) => car.status === "rented").length;
  const maintenanceCars = cars.filter(
    (car) => car.status === "maintenance"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить новый автомобиль</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом автомобиле для добавления в
                автопарк.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Номерной знак</Label>
                  <Input id="licensePlate" placeholder="А123БВ77" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Марка</Label>
                  <Input id="brand" placeholder="Toyota" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Модель</Label>
                  <Input id="model" placeholder="Camry" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Год выпуска</Label>
                  <Input id="year" type="number" placeholder="2023" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Цвет</Label>
                  <Input id="color" placeholder="Белый" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Эконом</SelectItem>
                      <SelectItem value="comfort">Комфорт</SelectItem>
                      <SelectItem value="business">Бизнес</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyPrice">Цена за день (₽)</Label>
                  <Input id="dailyPrice" type="number" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Пробег (км)</Label>
                  <Input id="mileage" type="number" placeholder="15000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input id="location" placeholder="Москва, ул. Тверская, 1" />
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
                Добавить автомобиль
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего автомобилей
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cars.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доступно</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableCars}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В аренде</CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {rentedCars}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                На обслуживании
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {maintenanceCars}
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
                    placeholder="Поиск по номеру, марке или модели..."
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
                  <SelectItem value="available">Доступен</SelectItem>
                  <SelectItem value="rented">Арендован</SelectItem>
                  <SelectItem value="maintenance">Обслуживание</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="economy">Эконом</SelectItem>
                  <SelectItem value="comfort">Комфорт</SelectItem>
                  <SelectItem value="business">Бизнес</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Список автомобилей</CardTitle>
            <CardDescription>
              Найдено {filteredCars.length} автомобилей из {cars.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Цена/день</TableHead>
                    <TableHead>Пробег</TableHead>
                    <TableHead>Местоположение</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {car.year} • {car.color}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {car.licensePlate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[car.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[car.status]}>
                          {statusLabels[car.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {car.dailyPrice.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          {car.currentMileage.toLocaleString()} км
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 max-w-[200px]">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">
                            {car.location}
                          </span>
                        </div>
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
                              Просмотр истории
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Удалить
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
