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
import { Search, MapPin, Navigation, Plus, Edit, Trash2 } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";


import { usePoints } from "../hooks/use-points";
import { TNewPoint, TPoint } from "@/db/schema";

const pointFields = [
  {
    key: "address",
    label: "Адрес",
    type: "text" as const,
    placeholder: "Введите краткий адрес"
  },
  {
    key: "fullAddress",
    label: "Полный адрес",
    type: "text" as const,
    placeholder: "Введите полный адрес"
  },
  {
    key: "latitude",
    label: "Широта",
    type: "text" as const,
    placeholder: "Введите широту"
  },
  {
    key: "longitude",
    label: "Долгота",
    type: "text" as const,
    placeholder: "Введите долготу"
  },
];

export default function PointsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addressFilter, setAddressFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<TPoint | null>(null);
  const [newPointData, setNewPointData] = useState<TNewPoint>({
    address: "",
    fullAddress: "",
    latitude: "",
    longitude: "",
  });

  const {
    points,
    isPointsLoading,
    createPoint,
    isCreatePointLoading,
    deletePoint,
    updatePoint,
    isUpdatePointLoading,
    isDeletePointLoading,
  } = usePoints(() => setIsAddDialogOpen(false));

  let filteredPoints: TPoint[] = [];
  let totalPoints = 0;
  let moscowPoints = 0;
  let spbPoints = 0;
  let otherCitiesPoints = 0;

  if (points) {
    filteredPoints = points.filter((point: TPoint) => {
      const matchesSearch = point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           point.fullAddress.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesAddress = true;
      if (addressFilter === "moscow") {
        matchesAddress = point.fullAddress.toLowerCase().includes("москва");
      } else if (addressFilter === "spb") {
        matchesAddress = point.fullAddress.toLowerCase().includes("санкт-петербург") ||
                        point.fullAddress.toLowerCase().includes("петербург");
      } else if (addressFilter === "other") {
        matchesAddress = !point.fullAddress.toLowerCase().includes("москва") &&
                        !point.fullAddress.toLowerCase().includes("санкт-петербург") &&
                        !point.fullAddress.toLowerCase().includes("петербург");
      }

      return matchesSearch && matchesAddress;
    });

    totalPoints = points.length;
    moscowPoints = points.filter(p => 
      p.fullAddress.toLowerCase().includes("москва")
    ).length;
    spbPoints = points.filter(p => 
      p.fullAddress.toLowerCase().includes("санкт-петербург") ||
      p.fullAddress.toLowerCase().includes("петербург")
    ).length;
    otherCitiesPoints = totalPoints - moscowPoints - spbPoints;
  }

  const handleAddPoint = () => {
    createPoint(newPointData);
    setNewPointData({
      address: "",
      fullAddress: "",
      latitude: "",
      longitude: "",
    });
  };

  const handleDeletePoint = () => {
    if (selectedPoint) {
      deletePoint(selectedPoint.id);
      setIsDrawerOpen(false);
      setSelectedPoint(null);
    }
  };

  const handleRowClick = (point: TPoint) => {
    setSelectedPoint({ ...point });
    setIsDrawerOpen(true);
  };

  const handleSavePoint = () => {
    if (selectedPoint) {
      updatePoint({
        id: selectedPoint.id,
        point: {
          address: selectedPoint.address,
          fullAddress: selectedPoint.fullAddress,
          latitude: selectedPoint.latitude,
          longitude: selectedPoint.longitude,
        },
      });
      setIsDrawerOpen(false);
      setSelectedPoint(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedPoint(null);
      }, 150);
    }
  };

  const handleOpenInMap = (point: TPoint) => {
    const mapUrl = `https://yandex.ru/maps/?pt=${point.longitude},${point.latitude}&z=15`;
    window.open(mapUrl, '_blank');
  };

  if (isPointsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных о точках...
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
                Всего точек
              </CardTitle>
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalPoints}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В Москве
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {moscowPoints}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В Санкт-Петербурге
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {spbPoints}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В других городах
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {otherCitiesPoints}
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
              Найдите нужную точку
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по адресу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={addressFilter} onValueChange={setAddressFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Город" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все города</SelectItem>
                  <SelectItem value="moscow">Москва</SelectItem>
                  <SelectItem value="spb">Санкт-Петербург</SelectItem>
                  <SelectItem value="other">Другие города</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Point Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Создать новую точку</DialogTitle>
              <DialogDescription>
                Заполните информацию о новой точке компании.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  placeholder="ул. Тверская, 1"
                  value={newPointData.address}
                  onChange={(e) =>
                    setNewPointData({
                      ...newPointData,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Полный адрес</Label>
                <Input
                  id="fullAddress"
                  placeholder="г. Москва, ул. Тверская, д. 1, стр. 1"
                  value={newPointData.fullAddress}
                  onChange={(e) =>
                    setNewPointData({
                      ...newPointData,
                      fullAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Широта</Label>
                  <Input
                    id="latitude"
                    placeholder="55.7558"
                    value={newPointData.latitude}
                    onChange={(e) =>
                      setNewPointData({
                        ...newPointData,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Долгота</Label>
                  <Input
                    id="longitude"
                    placeholder="37.6173"
                    value={newPointData.longitude}
                    onChange={(e) =>
                      setNewPointData({
                        ...newPointData,
                        longitude: e.target.value,
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
                onClick={handleAddPoint}
                disabled={isCreatePointLoading}
              >
                {isCreatePointLoading
                  ? "Создание..."
                  : "Создать точку"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список точек компании
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredPoints.length} точек из {points?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать точку
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Адрес</TableHead>
                    <TableHead>Полный адрес</TableHead>
                    <TableHead>Координаты</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPoints.map((point: TPoint) => (
                    <TableRow
                      key={point.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(point)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            #{point.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-foreground">
                          {point.address}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">
                          {point.fullAddress}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {point.latitude}, {point.longitude}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInMap(point);
                            }}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(point);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (point.id) handleDeletePoint();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
        entity={selectedPoint}
        onEntityChange={setSelectedPoint}
        onSave={handleSavePoint}
        onDelete={handleDeletePoint}
        isSaving={isUpdatePointLoading}
        isDeleting={isDeletePointLoading}
        title="Редактирование точки"
        description="Измените данные точки и нажмите 'Сохранить'"
        fields={pointFields as any}
        additionalInfo={
          selectedPoint && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID точки
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedPoint.id}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Открыть на карте
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenInMap(selectedPoint)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Яндекс.Карты
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}