import { useQuery, useMutation, useQueryClient, usePrefetchQuery } from "@tanstack/react-query";
import { useMemo } from "react";


import { hijackingService } from "../services/hijacking-service";
import { THijacking, TNewHijacking, TUpdateHijacking } from "../db/schema";
import { useDatabase } from "tauri-react-sqlite";
import { customToast } from "@/components/shared/toast-custom";

export const useHijacking = (callback?: () => void) => {
  const queryClient = useQueryClient();
  const db = useDatabase();

  const { data: hijackings, isLoading: isHijackingsLoading } = useQuery({
    queryKey: ["hijackings"],
    queryFn: () => hijackingService.getHijackings(db),
    refetchInterval: 60000,
  });

  const prefetchHijackings = usePrefetchQuery({
    queryKey: ['hijackings'],
    queryFn: () => hijackingService.getHijackings(db),
    staleTime: 60000,
  })

  const { mutate: createHijacking, isPending: isCreateHijackingLoading } = useMutation({
    mutationKey: ["create hijacking"],
    mutationFn: (hijacking: TNewHijacking) => hijackingService.createHijacking(db, hijacking),
    onMutate() {
      customToast.loading("create hijacking", "Создание записи об угоне/ДТП...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<THijacking[]>(["hijackings"], (oldData) => {
        if (!oldData) return oldData;
        const data: THijacking[] = Array.prototype.concat(newData, oldData);
        return data;
      });
      customToast.success("create hijacking", "Запись об угоне/ДТП успешно создана!");
      if (callback) callback();
    },
  });

  const { mutate: updateHijacking, isPending: isUpdateHijackingLoading } = useMutation({
    mutationKey: ["update hijacking"],
    mutationFn: ({ id, hijacking }: { id: number; hijacking: TUpdateHijacking }) =>
      hijackingService.updateHijacking(db, id, hijacking),
    onMutate() {
      customToast.loading("update hijacking", "Обновление записи об угоне/ДТП...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<THijacking[]>(["hijackings"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.map((hijacking) =>
          hijacking.id == newData[0].id ? newData[0] : hijacking,
        );
        return data;
      });
      customToast.success("update hijacking", "Запись об угоне/ДТП успешно обновлена!");
    },
  });

  const { mutate: deleteHijacking, isPending: isDeleteHijackingLoading } = useMutation({
    mutationKey: ["delete hijacking"],
    mutationFn: (id: number) => hijackingService.deleteHijacking(db, id),
    onMutate() {
      customToast.loading("delete hijacking", "Удаление записи об угоне/ДТП...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<THijacking[]>(["hijackings"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.filter((hijacking) => hijacking.id !== newData[0].id);
        return data;
      });
      customToast.success("delete hijacking", "Запись об угоне/ДТП успешно удалена!");
    },
  });

  return useMemo(
    () => ({
      hijackings,
      isHijackingsLoading,
      createHijacking,
      isCreateHijackingLoading,
      updateHijacking,
      isUpdateHijackingLoading,
      deleteHijacking,
      isDeleteHijackingLoading,
      prefetchHijackings
    }),
    [
      hijackings || [],
      isHijackingsLoading,
      createHijacking,
      isCreateHijackingLoading,
      updateHijacking,
      isUpdateHijackingLoading,
      deleteHijacking,
      isDeleteHijackingLoading,
      prefetchHijackings
    ],
  );
};