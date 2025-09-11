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
import { Search, Car, MapPin, Gauge, Plus } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { ICreateCar, ICar } from "@/types/cars-types";
import { useCars } from "@/hooks/use-cars";

const statusColors = {
  available: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
  rented: "bg-blue-500/10 text-blue-700 border-blue-200/50",
  maintenance: "bg-amber-500/10 text-amber-700 border-amber-200/50",
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

const carFields = [
  { key: "licensePlate", label: "Номерной знак", type: "text" as const },
  { key: "brand", label: "Марка", type: "text" as const },
  { key: "model", label: "Модель", type: "text" as const },
  { key: "year", label: "Год выпуска", type: "number" as const },
  { key: "color", label: "Цвет", type: "text" as const },
  {
    key: "category",
    label: "Категория",
    type: "select" as const,
    options: [
      { value: "economy", label: "Эконом" },
      { value: "comfort", label: "Комфорт" },
      { value: "business", label: "Бизнес" },
    ],
  },
  {
    key: "status",
    label: "Статус",
    type: "select" as const,
    options: [
      { value: "available", label: "Доступен" },
      { value: "rented", label: "Арендован" },
      { value: "maintenance", label: "Обслуживание" },
    ],
  },
  { key: "dailyPrice", label: "Цена за день (₽)", type: "number" as const },
  { key: "currentMileage", label: "Пробег (км)", type: "number" as const },
  { key: "location", label: "Местоположение", type: "text" as const },
];

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [newCarData, setNewCarData] = useState<ICreateCar>({
    licensePlate: "",
    brand: "",
    model: "",
    year: 0,
    color: "",
    category: "economy",
    dailyPrice: 0,
    isAvailable: false,
    currentMileage: 0,
    status: "available",
    location: "",
  });

  const {
    cars,
    isCarsLoading,
    createCar,
    isCreateCarLoading,
    deleteCar,
    updateCar,
    isUpdateCarLoading,
    isDeleteCarLoading,
  } = useCars(() => setIsAddDialogOpen(false));

  let filteredCars = [];
  let maintenanceCars = 0;
  let availableCars = 0;
  let rentedCars = 0;

  if (cars) {
    filteredCars = cars.filter(
      (car: {
        licensePlate: string;
        brand: string;
        model: string;
        status: string;
        category: string;
      }) => {
        const matchesSearch =
          car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || car.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || car.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      }
    );

    availableCars = cars.filter(
      (car: { status: string }) => car.status === "available"
    ).length;
    rentedCars = cars.filter(
      (car: { status: string }) => car.status === "rented"
    ).length;
    maintenanceCars = cars.filter(
      (car: { status: string }) => car.status === "maintenance"
    ).length;
  }

  const handleAddCar = () => {
    createCar(newCarData);
    setNewCarData({
      licensePlate: "",
      brand: "",
      model: "",
      year: 0,
      color: "",
      category: "economy",
      dailyPrice: 0,
      isAvailable: false,
      currentMileage: 0,
      status: "available",
      location: "",
    });
  };

  const handleDeleteCar = () => {
    if (selectedCar) {
      deleteCar(selectedCar.id);
      setIsDrawerOpen(false);
      setSelectedCar(null);
    }
  };

  const handleRowClick = (car: ICar) => {
    setSelectedCar({ ...car });
    setIsDrawerOpen(true);
  };

  const handleSaveCar = () => {
    if (selectedCar) {
      updateCar({
        car: {
          licensePlate: selectedCar.licensePlate,
          brand: selectedCar.brand,
          model: selectedCar.model,
          year: selectedCar.year,
          color: selectedCar.color,
          category: selectedCar.category,
          dailyPrice: selectedCar.dailyPrice,
          isAvailable: selectedCar.isAvailable,
          currentMileage: selectedCar.currentMileage,
          status: selectedCar.status,
          location: selectedCar.location,
        },
        id: selectedCar.id,
      });
      setIsDrawerOpen(false);
      setSelectedCar(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedCar(null);
      }, 150);
    }
  };

  if (isCarsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных об автомобилях...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего автомобилей
              </CardTitle>
              <Car className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {cars?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Доступно
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {availableCars}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В аренде
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {rentedCars}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                На обслуживании
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {maintenanceCars}
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
              Найдите нужный автомобиль с помощью фильтров
            </CardDescription>
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

        {/* Add Car Dialog */}
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
                  <Input
                    id="licensePlate"
                    placeholder="А123БВ77"
                    value={newCarData.licensePlate}
                    onChange={(e) =>
                      setNewCarData({
                        ...newCarData,
                        licensePlate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Марка</Label>
                  <Input
                    id="brand"
                    placeholder="Toyota"
                    value={newCarData.brand}
                    onChange={(e) =>
                      setNewCarData({ ...newCarData, brand: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Модель</Label>
                  <Input
                    id="model"
                    placeholder="Camry"
                    value={newCarData.model}
                    onChange={(e) =>
                      setNewCarData({ ...newCarData, model: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Год выпуска</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={newCarData.year}
                    onChange={(e) =>
                      setNewCarData({
                        ...newCarData,
                        year: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Цвет</Label>
                  <Input
                    id="color"
                    placeholder="Белый"
                    value={newCarData.color}
                    onChange={(e) =>
                      setNewCarData({ ...newCarData, color: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={newCarData.category}
                    onValueChange={(
                      value: "economy" | "comfort" | "business"
                    ) => setNewCarData({ ...newCarData, category: value })}
                  >
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
                  <Input
                    id="dailyPrice"
                    type="number"
                    placeholder="2500"
                    value={newCarData.dailyPrice}
                    onChange={(e) =>
                      setNewCarData({
                        ...newCarData,
                        dailyPrice: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Пробег (км)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="15000"
                    value={newCarData.currentMileage}
                    onChange={(e) =>
                      setNewCarData({
                        ...newCarData,
                        currentMileage: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input
                  id="location"
                  placeholder="Москва, ул. Тверская, 1"
                  value={newCarData.location}
                  onChange={(e) =>
                    setNewCarData({ ...newCarData, location: e.target.value })
                  }
                />
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
                variant={"outline"}
                onClick={handleAddCar}
                disabled={isCreateCarLoading}
              >
                {isCreateCarLoading ? "Добавление..." : "Добавить автомобиль"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список автомобилей
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredCars.length} автомобилей из {cars?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить автомобиль
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car: ICar) => (
                    <TableRow
                      key={car.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(car)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Car className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {car.year} • {car.color}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-foreground">
                        {car.licensePlate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {categoryLabels[car.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[car.status]}>
                          {statusLabels[car.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {car.dailyPrice.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {car.currentMileage.toLocaleString()} км
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground truncate">
                            {car.location}
                          </span>
                        </div>
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
        entity={selectedCar}
        onEntityChange={setSelectedCar}
        onSave={handleSaveCar}
        onDelete={handleDeleteCar}
        isSaving={isUpdateCarLoading}
        isDeleting={isDeleteCarLoading}
        title="Редактирование автомобиля"
        description="Измените данные автомобиля и нажмите 'Сохранить'"
        fields={carFields}
        additionalInfo={
          selectedCar && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата добавления
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {selectedCar.createdAt
                      ? new Date(selectedCar.createdAt).toLocaleDateString(
                          "ru-RU"
                        )
                      : "Не указана"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Последнее обновление
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {selectedCar.updatedAt
                      ? new Date(selectedCar.updatedAt).toLocaleDateString(
                          "ru-RU"
                        )
                      : "Не указана"}
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
