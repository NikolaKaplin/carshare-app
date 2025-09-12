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
import { Search, User, Mail, Phone, Plus } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { ICreateClient, IClient } from "@/types/client-types";
import { useClients } from "@/hooks/use-clients";

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-700 border-emerald-200/50",
  inactive: "bg-gray-500/10 text-gray-700 border-gray-200/50",
};

const statusLabels = {
  active: "Активен",
  inactive: "Неактивен",
};

const roleLabels = {
  client: "Клиент",
  admin: "Администратор",
};

const clientFields = [
  { key: "username", label: "Имя пользователя", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "phone", label: "Телефон", type: "text" as const },
  { key: "fullName", label: "Полное имя", type: "text" as const },
  {
    key: "driverLicense",
    label: "Водительское удостоверение",
    type: "text" as const,
  },
  {
    key: "role",
    label: "Роль",
    type: "select" as const,
    options: [
      { value: "client", label: "Клиент" },
      { value: "admin", label: "Администратор" },
    ],
  },
  {
    key: "isActive",
    label: "Статус",
    type: "select" as const,
    options: [
      { value: "true", label: "Активен" },
      { value: "false", label: "Неактивен" },
    ],
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [newClientData, setNewClientData] = useState<ICreateClient>({
    username: "",
    email: "",
    phone: "",
    fullName: "",
    driverLicense: "",
    role: "client",
    isActive: true,
  });

  const {
    clients,
    isClientsLoading,
    createClient,
    isCreateClientLoading,
    deleteClient,
    updateClient,
    isUpdateClientLoading,
    isDeleteClientLoading,
  } = useClients(() => setIsAddDialogOpen(false));

  let filteredClients: IClient[] = [];
  let activeClients = 0;
  let inactiveClients = 0;
  let adminClients = 0;
  //@ts-ignore
  let regularClients = 0;

  if (clients) {
    filteredClients = clients.filter(
      (client: {
        username: string;
        email: string;
        fullName: string;
        phone: string;
        isActive: boolean;
        role: string;
      }) => {
        const matchesSearch =
          client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && client.isActive) ||
          (statusFilter === "inactive" && !client.isActive);
        const matchesRole = roleFilter === "all" || client.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      }
    );

    activeClients = clients.filter(
      (client: { isActive: boolean }) => client.isActive
    ).length;
    inactiveClients = clients.filter(
      (client: { isActive: boolean }) => !client.isActive
    ).length;
    adminClients = clients.filter(
      (client: { role: string }) => client.role === "admin"
    ).length;
    regularClients = clients.filter(
      (client: { role: string }) => client.role === "client"
    ).length;
  }

  const handleAddClient = () => {
    createClient(newClientData);
    setNewClientData({
      username: "",
      email: "",
      phone: "",
      fullName: "",
      driverLicense: "",
      role: "client",
      isActive: true,
    });
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setIsDrawerOpen(false);
      setSelectedClient(null);
    }
  };

  const handleRowClick = (client: IClient) => {
    setSelectedClient({ ...client });
    setIsDrawerOpen(true);
  };

  const handleSaveClient = () => {
    if (selectedClient) {
      updateClient({
        id: selectedClient.id,
        client: {
          username: selectedClient.username,
          email: selectedClient.email,
          phone: selectedClient.phone,
          fullName: selectedClient.fullName,
          driverLicense: selectedClient.driverLicense,
          role: selectedClient.role,
          isActive: selectedClient.isActive,
        },
      });
      setIsDrawerOpen(false);
      setSelectedClient(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedClient(null);
      }, 150);
    }
  };

  if (isClientsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных о клиентах...
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
                Всего клиентов
              </CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {clients?.length || 0}
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
                {activeClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Администраторы
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {adminClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Неактивные
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {inactiveClients}
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
              Найдите нужного клиента с помощью фильтров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по имени, email или телефону..."
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
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="client">Клиенты</SelectItem>
                  <SelectItem value="admin">Администраторы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Client Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить нового клиента</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом клиенте для добавления в систему.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    placeholder="john_doe"
                    value={newClientData.username}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newClientData.email}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (999) 999-99-99"
                    value={newClientData.phone}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input
                    id="fullName"
                    placeholder="Иван Иванов"
                    value={newClientData.fullName}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">
                    Водительское удостоверение
                  </Label>
                  <Input
                    id="driverLicense"
                    placeholder="1234 567890"
                    value={newClientData.driverLicense!}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        driverLicense: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select
                    value={newClientData.role}
                    onValueChange={(value: "client" | "admin") =>
                      setNewClientData({ ...newClientData, role: value })
                    }
                  >
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
                <Label htmlFor="isActive">Статус</Label>
                <Select
                  value={newClientData.isActive ? "true" : "false"}
                  onValueChange={(value: "true" | "false") =>
                    setNewClientData({
                      ...newClientData,
                      isActive: value === "true",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Активен</SelectItem>
                    <SelectItem value="false">Неактивен</SelectItem>
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
                onClick={handleAddClient}
                disabled={isCreateClientLoading}
              >
                {isCreateClientLoading ? "Добавление..." : "Добавить клиента"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список клиентов
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredClients.length} клиентов из{" "}
                {clients?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить клиента
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Водительское удостоверение</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client: IClient) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(client)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {client.fullName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @{client.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {client.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {roleLabels[client.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            client.isActive
                              ? statusColors.active
                              : statusColors.inactive
                          }
                        >
                          {client.isActive
                            ? statusLabels.active
                            : statusLabels.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {client.driverLicense || "Не указано"}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {client.createdAt
                          ? new Date(client.createdAt).toLocaleDateString(
                              "ru-RU"
                            )
                          : "Не указана"}
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
        entity={selectedClient}
        onEntityChange={setSelectedClient}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
        isSaving={isUpdateClientLoading}
        isDeleting={isDeleteClientLoading}
        title="Редактирование клиента"
        description="Измените данные клиента и нажмите 'Сохранить'"
        fields={clientFields}
        additionalInfo={
          selectedClient && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата регистрации
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {selectedClient.createdAt
                      ? new Date(selectedClient.createdAt).toLocaleDateString(
                          "ru-RU"
                        )
                      : "Не указана"}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID клиента
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedClient.id}
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
