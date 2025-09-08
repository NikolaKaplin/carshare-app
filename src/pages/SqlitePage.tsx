import type React from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  HardDrive,
} from "lucide-react";

type ExportFormat = "sqlite" | "excel" | "csv";
type ImportStatus = "idle" | "uploading" | "processing" | "success" | "error";
type ExportStatus = "idle" | "generating" | "success" | "error";

export default function ImportExportPage() {
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("sqlite");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [importMessage, setImportMessage] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus("idle");
      setImportMessage("");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImportStatus("uploading");
    setImportProgress(0);
    setImportMessage("Загрузка файла...");

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 50) {
          clearInterval(uploadInterval);
          setImportStatus("processing");
          setImportMessage("Обработка данных...");

          // Simulate processing
          const processInterval = setInterval(() => {
            setImportProgress((prev) => {
              if (prev >= 100) {
                clearInterval(processInterval);
                setImportStatus("success");
                setImportMessage(
                  "Импорт завершен успешно! Обработано записей: 1,247"
                );
                return 100;
              }
              return prev + 2;
            });
          }, 100);

          return 50;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleExport = async () => {
    setExportStatus("generating");
    setExportProgress(0);
    setExportMessage("Подготовка данных для экспорта...");

    // Simulate export progress
    const exportInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(exportInterval);
          setExportStatus("success");
          setExportMessage(`Экспорт завершен! Файл готов к скачиванию.`);
          return 100;
        }
        return prev + 3;
      });
    }, 150);
  };

  const downloadFile = () => {
    // Simulate file download
    const fileName = `carsharing_backup_${
      new Date().toISOString().split("T")[0]
    }.${exportFormat}`;
    setExportMessage(`Скачивание файла: ${fileName}`);
  };

  const resetImport = () => {
    setImportStatus("idle");
    setImportProgress(0);
    setImportMessage("");
    setSelectedFile(null);
  };

  const resetExport = () => {
    setExportStatus("idle");
    setExportProgress(0);
    setExportMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Импорт данных
              </CardTitle>
              <CardDescription>
                Загрузите файл базы данных SQLite для восстановления данных
                системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importStatus === "idle" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="import-file">
                      Выберите файл базы данных
                    </Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".db,.sqlite,.sqlite3"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Поддерживаемые форматы: .db, .sqlite, .sqlite3
                    </p>
                  </div>

                  {selectedFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        Выбран файл: <strong>{selectedFile.name}</strong> (
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleImport}
                    disabled={!selectedFile}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Начать импорт
                  </Button>
                </>
              )}

              {(importStatus === "uploading" ||
                importStatus === "processing") && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{importMessage}</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {importProgress}% завершено
                  </p>
                </div>
              )}

              {importStatus === "success" && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {importMessage}
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={resetImport}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Импортировать другой файл
                  </Button>
                </div>
              )}

              {importStatus === "error" && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Ошибка при импорте файла. Проверьте формат и целостность
                      данных.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={resetImport}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Попробовать снова
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                Экспорт данных
              </CardTitle>
              <CardDescription>
                Создайте резервную копию базы данных в различных форматах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportStatus === "idle" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Формат экспорта</Label>
                    <Select
                      value={exportFormat}
                      onValueChange={(value: ExportFormat) =>
                        setExportFormat(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqlite">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4" />
                            SQLite Database (.db)
                          </div>
                        </SelectItem>
                        <SelectItem value="excel">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel Workbook (.xlsx)
                          </div>
                        </SelectItem>
                        <SelectItem value="csv">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            CSV Files (.csv)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium mb-2">
                      Что будет экспортировано:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Автомобили и их характеристики</li>
                      <li>• Клиенты и контактная информация</li>
                      <li>• История бронирований</li>
                      <li>• Платежи и транзакции</li>
                      <li>• Записи технического обслуживания</li>
                    </ul>
                  </div>

                  <Button onClick={handleExport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Создать резервную копию
                  </Button>
                </>
              )}

              {exportStatus === "generating" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{exportMessage}</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {exportProgress}% завершено
                  </p>
                </div>
              )}

              {exportStatus === "success" && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {exportMessage}
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button onClick={downloadFile} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Скачать файл
                    </Button>
                    <Button
                      onClick={resetExport}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      Новый экспорт
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Статистика базы данных
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Автомобили
                </span>
                <Badge variant="secondary">127</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Клиенты</span>
                <Badge variant="secondary">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Бронирования
                </span>
                <Badge variant="secondary">3,891</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Платежи</span>
                <Badge variant="secondary">3,654</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Последние резервные копии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">backup_2024-01-15.db</div>
                <div className="text-muted-foreground">15 января, 14:30</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">export_2024-01-10.xlsx</div>
                <div className="text-muted-foreground">10 января, 09:15</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">backup_2024-01-05.db</div>
                <div className="text-muted-foreground">5 января, 18:45</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Рекомендации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Рекомендуется создавать резервные копии еженедельно
                </AlertDescription>
              </Alert>
              <div className="text-xs text-muted-foreground">
                <p>• SQLite - полная копия базы данных</p>
                <p>• Excel - удобно для анализа данных</p>
                <p>• CSV - совместимость с другими системами</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
