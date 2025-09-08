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
  Users,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

// Mock data based on the clients schema
const mockClients = [
  {
    id: "1",
    username: "ivan_petrov",
    email: "ivan.petrov@email.com",
    role: "client" as const,
    phone: "+7 (999) 123-45-67",
    fullName: "Иван Петров",
    driverLicense: "77 АА 123456",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    username: "maria_sidorova",
    email: "maria.sidorova@email.com",
    role: "client" as const,
    phone: "+7 (999) 234-56-78",
    fullName: "Мария Сидорова",
    driverLicense: "77 ВВ 234567",
    isActive: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    username: "admin_alex",
    email: "alex.admin@company.com",
    role: "admin" as const,
    phone: "+7 (999) 345-67-89",
    fullName: "Александр Админов",
    driverLicense: null,
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    username: "sergey_kozlov",
    email: "sergey.kozlov@email.com",
    role: "client" as const,
    phone: "+7 (999) 456-78-90",
    fullName: "Сергей Козлов",
    driverLicense: "77 СС 345678",
    isActive: false,
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "5",
    username: "elena_volkova",
    email: "elena.volkova@email.com",
    role: "client" as const,
    phone: "+7 (999) 567-89-01",
    fullName: "Елена Волкова",
    driverLicense: "77 ДД 456789",
    isActive: true,
    createdAt: new Date("2024-02-28"),
  },
];

const roleColors = {
  client: "bg-blue-100 text-blue-800 border-blue-200",
  admin: "bg-purple-100 text-purple-800 border-purple-200",
};

const roleLabels = {
  client: "Клиент",
  admin: "Администратор",
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  active: "Активен",
  inactive: "Неактивен",
};

export default function ClientsPage() {
  const [clients, _setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || client.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && client.isActive) ||
      (statusFilter === "inactive" && !client.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.isActive).length;
  const adminUsers = clients.filter((client) => client.role === "admin").length;
  const regularClients = clients.filter(
    (client) => client.role === "client"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить нового клиента</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом клиенте для регистрации в системе.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input id="username" placeholder="ivan_petrov" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input id="fullName" placeholder="Иван Петров" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan.petrov@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" placeholder="+7 (999) 123-45-67" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Клиент</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverLicense">
                  Водительское удостоверение
                </Label>
                <Input id="driverLicense" placeholder="77 АА 123456" />
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
                Добавить клиента
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
                Всего клиентов
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Обычные клиенты
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {regularClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Администраторы
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {adminUsers}
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
                    placeholder="Поиск по имени, email, телефону..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="client">Клиент</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Список клиентов</CardTitle>
            <CardDescription>
              Найдено {filteredClients.length} клиентов из {totalClients}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Водительские права</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{client.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              @{client.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[client.role]}>
                          {roleLabels[client.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[
                              client.isActive ? "active" : "inactive"
                            ]
                          }
                        >
                          {
                            statusLabels[
                              client.isActive ? "active" : "inactive"
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {client.driverLicense ? (
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {client.driverLicense}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Не указано
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {client.createdAt.toLocaleDateString("ru-RU")}
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
                              История бронирований
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {client.isActive
                                ? "Деактивировать"
                                : "Активировать"}
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
