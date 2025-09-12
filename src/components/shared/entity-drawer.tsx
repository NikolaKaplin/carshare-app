import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface Field {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  readOnly?: boolean;
}

interface EntityDrawerProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entity: T | null;
  onEntityChange: (entity: T) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  title: string;
  description: string;
  fields: Field[];
  additionalInfo?: ReactNode;
}

export function EntityDrawer<T extends Record<string, any>>({
  isOpen,
  onOpenChange,
  entity,
  onEntityChange,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
  title,
  description,
  fields,
  additionalInfo,
}: EntityDrawerProps<T>) {
  const [originalEntity, setOriginalEntity] = useState<T | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && entity) {
      setOriginalEntity({ ...entity });
      setHasChanges(false);
    }
  }, [isOpen, entity]);

  useEffect(() => {
    if (originalEntity && entity) {
      const changed = JSON.stringify(originalEntity) !== JSON.stringify(entity);
      setHasChanges(changed);
    }
  }, [originalEntity, entity]);

  const handleFieldChange = (key: string, value: any) => {
    if (entity) {
      onEntityChange({
        ...entity,
        [key]: value,
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-background">
        <SheetHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold text-foreground">
                {title}
              </SheetTitle>
              <SheetDescription className="mt-2 text-muted-foreground">
                {description}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Dialog open={isDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Вы уверены, что хотите удалить этот элемент?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  if (onDelete) {
                    onDelete();
                    setIsDialogOpen(false);
                  }
                }}
                variant="destructive"
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {entity && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-5">
              {fields.map((field) => (
                <div key={field.key} className="space-y-3">
                  <Label
                    htmlFor={`drawer-${field.key}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {field.label}
                  </Label>
                  {field.type === "select" ? (
                    <Select
                      value={entity[field.key]?.toString() || ""}
                      onValueChange={(value) =>
                        handleFieldChange(field.key, value)
                      }
                      disabled={field.readOnly}
                    >
                      <SelectTrigger className="h-10 border-input bg-background">
                        <SelectValue
                          placeholder={`Выберите ${field.label.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`drawer-${field.key}`}
                      type={field.type}
                      value={entity[field.key] || ""}
                      onChange={(e) => {
                        const value =
                          field.type === "number"
                            ? Number.parseInt(e.target.value) || 0
                            : e.target.value;
                        handleFieldChange(field.key, value);
                      }}
                      readOnly={field.readOnly}
                      className={`h-10 border-input bg-background ${
                        field.readOnly ? "bg-muted text-muted-foreground" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {additionalInfo && (
              <div className="pt-6 border-t border-border m-5">
                {additionalInfo}
              </div>
            )}
          </div>
        )}

        <SheetFooter className="flex-row justify-end gap-3 mt-6 pt-6 border-t border-border">
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDialogOpen(true)}
              disabled={isDeleting}
              className="h-10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className="h-10"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
