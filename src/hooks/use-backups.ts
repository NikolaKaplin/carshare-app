import { useQuery, useMutation, useQueryClient, usePrefetchQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { TBackup, TUpdateBackup, TNewBackup } from "../db/schema";
import { customToast } from "@/components/shared/toast-custom";
import { backupsService } from "@/services/backup-service";
import { useDatabase } from "tauri-react-sqlite";


export const useBackups = (callback?: () => void) => {
  const queryClient = useQueryClient();
  const db = useDatabase();

  const { data: backups, isLoading: isBackupsLoading } = useQuery({
    queryKey: ["backups"],
    queryFn: () => backupsService.getBackups(db),
    refetchInterval: 60000,
  });

  const prefetchBackups = usePrefetchQuery({
    queryKey: ['backups'],
    queryFn: () => backupsService.getBackups(db),
    staleTime: 60000,
  })

  const { mutate: createBackup, isPending: isCreateBackupLoading } = useMutation({
    mutationKey: ["create backup"],
    mutationFn: (backup: TNewBackup) => backupsService.createBackup(db, backup),
    onMutate() {
      customToast.loading("create backup", "Создание резервной копии...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TBackup[]>(["backups"], (oldData) => {
        const data: TBackup[] = Array.prototype.concat(newData, oldData);
        return data;
      });
      customToast.success("create backup", "Резервная копия успешно создана!");
      if (callback) callback();
    },
  });

  const { mutate: updateBackup, isPending: isUpdateBackupLoading } = useMutation({
    mutationKey: ["update backup"],
    mutationFn: ({ id, backup }: { id: number; backup: TUpdateBackup }) =>
      backupsService.updateBackup(db, id, backup),
    onMutate() {
      customToast.loading("update backup", "Обновление резервной копии...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TBackup[]>(["backups"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.map((backup) =>
          backup.id == newData[0].id ? newData[0] : backup,
        );
        return data;
      });
      customToast.success("update backup", "Резервная копия успешно обновлена!");
    },
  });

  const { mutate: deleteBackup, isPending: isDeleteBackupLoading } = useMutation({
    mutationKey: ["delete backup"],
    mutationFn: (id: number) => backupsService.deleteBackup(db, id),
    onMutate() {
      customToast.loading("delete backup", "Удаление резервной копии...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TBackup[]>(["backups"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.filter((backup) => backup.id !== newData[0].id);
        return data;
      });
      customToast.success("delete backup", "Резервная копия успешно удалена!");
    },
  });

  return useMemo(
    () => ({
      backups,
      isBackupsLoading,
      createBackup,
      isCreateBackupLoading,
      updateBackup,
      isUpdateBackupLoading,
      deleteBackup,
      isDeleteBackupLoading,
      prefetchBackups
    }),
    [
      backups || [],
      isBackupsLoading,
      createBackup,
      isCreateBackupLoading,
      updateBackup,
      isUpdateBackupLoading,
      deleteBackup,
      isDeleteBackupLoading,
      prefetchBackups
    ],
  );
};