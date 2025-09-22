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
import { Search, Database, Download, Trash2, Plus, Calendar, Folder } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { TNewBackup, TBackup } from "../db/schema";
import { useBackups } from "@/hooks/use-backups";

const formatFileSize = (bytes: string) => {
  const size = parseInt(bytes);
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const backupFields = [
  {
    key: "fileSize",
    label: "Размер файла (байты)",
    type: "text" as const,
    placeholder: "Введите размер файла в байтах"
  },
  {
    key: "saveFolder",
    label: "Папка сохранения",
    type: "text" as const,
    placeholder: "Введите путь к папке сохранения"
  },
];

export default function BackupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<TBackup | null>(null);
  const [newBackupData, setNewBackupData] = useState<TNewBackup>({
    fileSize: "0",
    saveFolder: "",
  });

  const {
    backups,
    isBackupsLoading,
    createBackup,
    isCreateBackupLoading,
    deleteBackup,
    updateBackup,
    isUpdateBackupLoading,
    isDeleteBackupLoading,
  } = useBackups(() => setIsAddDialogOpen(false));

  let filteredBackups: TBackup[] = [];
  let totalSize = 0;
  let smallBackups = 0; // < 1MB
  let mediumBackups = 0; // 1MB - 100MB
  let largeBackups = 0; // > 100MB

  if (backups) {
    filteredBackups = backups.filter((backup: TBackup) => {
      const matchesSearch = backup.saveFolder
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const backupSize = parseInt(backup.fileSize);
      let matchesSize = true;
      
      if (sizeFilter === "small") matchesSize = backupSize < 1024 * 1024;
      else if (sizeFilter === "medium") matchesSize = backupSize >= 1024 * 1024 && backupSize < 100 * 1024 * 1024;
      else if (sizeFilter === "large") matchesSize = backupSize >= 100 * 1024 * 1024;

      return matchesSearch && matchesSize;
    });

    totalSize = backups.reduce((sum, backup) => sum + parseInt(backup.fileSize), 0);
    
    backups.forEach(backup => {
      const size = parseInt(backup.fileSize);
      if (size < 1024 * 1024) smallBackups++;
      else if (size < 100 * 1024 * 1024) mediumBackups++;
      else largeBackups++;
    });
  }

  const handleAddBackup = () => {
    createBackup(newBackupData);
    setNewBackupData({
      fileSize: "0",
      saveFolder: "",
    });
  };

  const handleDeleteBackup = () => {
    if (selectedBackup) {
      deleteBackup(selectedBackup.id);
      setIsDrawerOpen(false);
      setSelectedBackup(null);
    }
  };

  const handleRowClick = (backup: TBackup) => {
    setSelectedBackup({ ...backup });
    setIsDrawerOpen(true);
  };

  const handleSaveBackup = () => {
    if (selectedBackup) {
      updateBackup({
        id: selectedBackup.id,
        backup: {
          fileSize: selectedBackup.fileSize,
          saveFolder: selectedBackup.saveFolder,
        },
      });
      setIsDrawerOpen(false);
      setSelectedBackup(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedBackup(null);
      }, 150);
    }
  };

  const handleDownloadBackup = (backup: TBackup) => {
    // Здесь будет логика скачивания резервной копии
    console.log("Download backup:", backup);
    // В реальном приложении здесь будет API вызов для скачивания
  };

  if (isBackupsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка данных о резервных копиях...
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
                Всего копий
              </CardTitle>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {backups?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Малые (&lt 1MB)
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {smallBackups}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Средние (1MB-100MB)
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {mediumBackups}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общий объем
              </CardTitle>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatFileSize(totalSize.toString())}
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
              Найдите нужную резервную копию
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по папке сохранения..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Размер файла" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все размеры</SelectItem>
                  <SelectItem value="small">Малые (&lt 1MB)</SelectItem>
                  <SelectItem value="medium">Средние (1MB-100MB)</SelectItem>
                  <SelectItem value="large">Большие (&gt 100MB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Backup Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Создать новую резервную копию</DialogTitle>
              <DialogDescription>
                Заполните информацию о новой резервной копии.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fileSize">Размер файла (байты)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  min="0"
                  value={newBackupData.fileSize}
                  onChange={(e) =>
                    setNewBackupData({
                      ...newBackupData,
                      fileSize: e.target.value,
                    })
                  }
                  placeholder="Введите размер в байтах"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saveFolder">Папка сохранения</Label>
                <Input
                  id="saveFolder"
                  placeholder="/backups/database/"
                  value={newBackupData.saveFolder}
                  onChange={(e) =>
                    setNewBackupData({
                      ...newBackupData,
                      saveFolder: e.target.value,
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
                onClick={handleAddBackup}
                disabled={isCreateBackupLoading}
              >
                {isCreateBackupLoading
                  ? "Создание..."
                  : "Создать резервную копию"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список резервных копий
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredBackups.length} копий из {backups?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать резервную копию
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Папка сохранения</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBackups.map((backup: TBackup) => (
                    <TableRow
                      key={backup.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(backup)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            #{backup.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {formatFileSize(backup.fileSize)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {backup.saveFolder}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {formatTimestamp(backup.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadBackup(backup);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBackup();
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
        entity={selectedBackup}
        onEntityChange={setSelectedBackup}
        onSave={handleSaveBackup}
        onDelete={handleDeleteBackup}
        isSaving={isUpdateBackupLoading}
        isDeleting={isDeleteBackupLoading}
        title="Редактирование резервной копии"
        description="Измените данные резервной копии и нажмите 'Сохранить'"
        fields={backupFields as any}
        additionalInfo={
          selectedBackup && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Форматированный размер
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {formatFileSize(selectedBackup.fileSize)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID копии
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedBackup.id}
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