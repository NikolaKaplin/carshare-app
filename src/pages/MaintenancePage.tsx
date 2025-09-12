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
  Wrench,
  Calendar,
  DollarSign,
  Gauge,
  Plus,
} from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type {
  ICreateMaintenance,
  IMaintenance,
} from "@/types/maintenance-types";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useCars } from "@/hooks/use-cars";

const costColors = {
  low: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
  medium: "bg-amber-500/10 text-amber-700 border-amber-200/50",
  high: "bg-red-500/10 text-red-700 border-red-200/50",
};

const getCostBadge = (cost: number) => {
  if (cost < 5000) return costColors.low;
  if (cost < 15000) return costColors.medium;
  return costColors.high;
};

const maintenanceFields = [
  {
    key: "carId",
    label: "Автомобиль",
    type: "select" as const,
    options: [] as { value: string; label: string }[],
  },
  { key: "description", label: "Описание обслуживания", type: "text" as const },
  { key: "cost", label: "Стоимость (₽)", type: "number" as const },
  { key: "date", label: "Дата обслуживания", type: "date" as const },
  { key: "mileage", label: "Пробег (км)", type: "number" as const },
];

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [costFilter, setCostFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<IMaintenance | null>(null);
  const [newMaintenanceData, setNewMaintenanceData] =
    useState<ICreateMaintenance>({
      carId: 0,
      description: "",
      cost: 0,
      date: new Date(),
      mileage: 0,
    });

  const {
    maintenances,
    isMaintenancesLoading,
    createMaintenance,
    isCreateMaintenanceLoading,
    deleteMaintenance,
    updateMaintenance,
    isUpdateMaintenanceLoading,
    isDeleteMaintenanceLoading,
  } = useMaintenance(() => setIsAddDialogOpen(false));

  const { cars } = useCars(() => {});

  maintenanceFields[0].options =
    cars?.map((car) => ({
      value: car.id.toString(),
      label: `${car.brand} ${car.model} (${car.licensePlate})`,
    })) || [];

  let filteredMaintenances: IMaintenance[] = [];
  let totalCost = 0;
  let lowCostMaintenances = 0;
  //@ts-ignore
  let mediumCostMaintenances = 0;
  let highCostMaintenances = 0;

  if (maintenances) {
    filteredMaintenances = maintenances.filter(
      (maintenance: { description: string; cost: number }) => {
        const matchesSearch = maintenance.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesCost =
          costFilter === "all" ||
          (costFilter === "low" && maintenance.cost < 5000) ||
          (costFilter === "medium" &&
            maintenance.cost >= 5000 &&
            maintenance.cost < 15000) ||
          (costFilter === "high" && maintenance.cost >= 15000);

        return matchesSearch && matchesCost;
      }
    );

    totalCost = maintenances.reduce(
      (sum, maintenance) => sum + maintenance.cost,
      0
    );
    lowCostMaintenances = maintenances.filter((m) => m.cost < 5000).length;
    mediumCostMaintenances = maintenances.filter(
      (m) => m.cost >= 5000 && m.cost < 15000
    ).length;
    highCostMaintenances = maintenances.filter((m) => m.cost >= 15000).length;
  }

  const getCarInfo = (carId: number) => {
    const car = cars?.find((c) => c.id === carId);
    return car
      ? `${car.brand} ${car.model} (${car.licensePlate})`
      : "Неизвестный автомобиль";
  };

  const handleAddMaintenance = () => {
    createMaintenance(newMaintenanceData);
    setNewMaintenanceData({
      carId: 0,
      description: "",
      cost: 0,
      date: new Date(),
      mileage: 0,
    });
  };

  const handleDeleteMaintenance = () => {
    if (selectedMaintenance) {
      deleteMaintenance(selectedMaintenance.id);
      setIsDrawerOpen(false);
      setSelectedMaintenance(null);
    }
  };

  const handleRowClick = (maintenance: IMaintenance) => {
    setSelectedMaintenance({ ...maintenance });
    setIsDrawerOpen(true);
  };

  const handleSaveMaintenance = () => {
    if (selectedMaintenance) {
      updateMaintenance({
        id: selectedMaintenance.id,
        maintenanceData: {
          carId: selectedMaintenance.carId,
          description: selectedMaintenance.description,
          cost: selectedMaintenance.cost,
          date: selectedMaintenance.date,
          mileage: selectedMaintenance.mileage,
        },
      });
      setIsDrawerOpen(false);
      setSelectedMaintenance(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedMaintenance(null);
      }, 150);
    }
  };

  if (isMaintenancesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных об обслуживании...
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
                Всего записей
              </CardTitle>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {maintenances?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общая стоимость
              </CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalCost.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Низкая стоимость
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {lowCostMaintenances}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Высокая стоимость
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {highCostMaintenances}
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
              Найдите нужную запись обслуживания
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
              <Select value={costFilter} onValueChange={setCostFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Стоимость" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все записи</SelectItem>
                  <SelectItem value="low">До 5,000 ₽</SelectItem>
                  <SelectItem value="medium">5,000-15,000 ₽</SelectItem>
                  <SelectItem value="high">От 15,000 ₽</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Maintenance Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить запись обслуживания</DialogTitle>
              <DialogDescription>
                Заполните информацию о проведенном обслуживании автомобиля.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="carId">Автомобиль</Label>
                <Select
                  value={newMaintenanceData.carId.toString()}
                  onValueChange={(value) =>
                    setNewMaintenanceData({
                      ...newMaintenanceData,
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
                <Label htmlFor="description">Описание обслуживания</Label>
                <Input
                  id="description"
                  placeholder="Замена масла, фильтров и т.д."
                  value={newMaintenanceData.description}
                  onChange={(e) =>
                    setNewMaintenanceData({
                      ...newMaintenanceData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Стоимость (₽)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="5000"
                    value={newMaintenanceData.cost}
                    onChange={(e) =>
                      setNewMaintenanceData({
                        ...newMaintenanceData,
                        cost: Number.parseFloat(e.target.value),
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
                    value={newMaintenanceData.mileage}
                    onChange={(e) =>
                      setNewMaintenanceData({
                        ...newMaintenanceData,
                        mileage: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Дата обслуживания</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMaintenanceData.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewMaintenanceData({
                      ...newMaintenanceData,
                      date: new Date(e.target.value),
                    })
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
                onClick={handleAddMaintenance}
                disabled={isCreateMaintenanceLoading}
              >
                {isCreateMaintenanceLoading
                  ? "Добавление..."
                  : "Добавить запись"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                История обслуживания
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredMaintenances.length} записей из{" "}
                {maintenances?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить запись
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Пробег</TableHead>
                    <TableHead>Дата обслуживания</TableHead>
                    <TableHead>Дата создания</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenances.map((maintenance: IMaintenance) => (
                    <TableRow
                      key={maintenance.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(maintenance)}
                    >
                      <TableCell className="font-semibold text-foreground">
                        {getCarInfo(maintenance.carId)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {maintenance.description}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCostBadge(maintenance.cost)}>
                          {maintenance.cost.toLocaleString()} ₽
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {maintenance.mileage.toLocaleString()} км
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {new Date(maintenance.date).toLocaleDateString(
                              "ru-RU"
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {new Date(maintenance.createdAt).toLocaleDateString(
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
        entity={selectedMaintenance}
        onEntityChange={setSelectedMaintenance}
        onSave={handleSaveMaintenance}
        onDelete={handleDeleteMaintenance}
        isSaving={isUpdateMaintenanceLoading}
        isDeleting={isDeleteMaintenanceLoading}
        title="Редактирование записи обслуживания"
        description="Измените данные обслуживания и нажмите 'Сохранить'"
        fields={maintenanceFields as any}
        additionalInfo={
          selectedMaintenance && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата создания записи
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {new Date(selectedMaintenance.createdAt).toLocaleDateString(
                      "ru-RU"
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID записи
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedMaintenance.id}
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
