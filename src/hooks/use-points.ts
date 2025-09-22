import { useQuery, useMutation, useQueryClient, usePrefetchQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { pointsService } from "../services/points-service";
import { useDatabase } from "tauri-react-sqlite";
import { customToast } from "@/components/shared/toast-custom";
import { TPoint, TNewPoint, TUpdatePoint } from "@/db/schema";


export const usePoints = (callback?: () => void) => {
  const queryClient = useQueryClient();
  const db = useDatabase();

  const { data: points, isLoading: isPointsLoading } = useQuery({
    queryKey: ["points"],
    queryFn: () => pointsService.getPoints(db),
    refetchInterval: 60000,
  });

  const prefetchPoints = usePrefetchQuery({
    queryKey: ['points'],
    queryFn: () => pointsService.getPoints(db),
    staleTime: 60000,
  })

  const { mutate: createPoint, isPending: isCreatePointLoading } = useMutation({
    mutationKey: ["create point"],
    mutationFn: (point: TNewPoint) => pointsService.createPoint(db, point),
    onMutate() {
      customToast.loading("create point", "Создание точки...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TPoint[]>(["points"], (oldData) => {
        if (!oldData) return oldData;
        const data: TPoint[] = Array.prototype.concat(newData, oldData);
        return data;
      });
      customToast.success("create point", "Точка успешно создана!");
      if (callback) callback();
    },
  });

  const { mutate: updatePoint, isPending: isUpdatePointLoading } = useMutation({
    mutationKey: ["update point"],
    mutationFn: ({ id, point }: { id: number; point: TUpdatePoint }) =>
      pointsService.updatePoint(db, id, point),
    onMutate() {
      customToast.loading("update point", "Обновление точки...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TPoint[]>(["points"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.map((point) =>
          point.id == newData[0].id ? newData[0] : point,
        );
        return data;
      });
      customToast.success("update point", "Точка успешно обновлена!");
    },
  });

  const { mutate: deletePoint, isPending: isDeletePointLoading } = useMutation({
    mutationKey: ["delete point"],
    mutationFn: (id: number) => pointsService.deletePoint(db, id),
    onMutate() {
      customToast.loading("delete point", "Удаление точки...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<TPoint[]>(["points"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.filter((point) => point.id !== newData[0].id);
        return data;
      });
      customToast.success("delete point", "Точка успешно удалена!");
    },
  });

  return useMemo(
    () => ({
      points,
      isPointsLoading,
      createPoint,
      isCreatePointLoading,
      updatePoint,
      isUpdatePointLoading,
      deletePoint,
      isDeletePointLoading,
      prefetchPoints
    }),
    [
      points || [],
      isPointsLoading,
      createPoint,
      isCreatePointLoading,
      updatePoint,
      isUpdatePointLoading,
      deletePoint,
      isDeletePointLoading,
      prefetchPoints
    ],
  );
};