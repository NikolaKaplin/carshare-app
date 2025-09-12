import { customToast } from "@/components/shared/toast-custom";
import { maintenanceService } from "@/services/maintenance.service";
import { IMaintenance, ICreateMaintenance, IUpdateMaintenance } from "@/types/maintenance-types";
import { useMutation, usePrefetchQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDatabase } from "tauri-react-sqlite";

export const useMaintenance = (callback?: () => void) => {
    const queryClient = useQueryClient();
    const db = useDatabase();

    const { data: maintenances, isLoading: isMaintenancesLoading } = useQuery({
        queryKey: ["maintenances"],
        queryFn: () => maintenanceService.getMaintenances(db),
        refetchInterval: 60000,
    });

    const prefetchMaintenances = usePrefetchQuery({
        queryKey: ['maintenances'],
        queryFn: () => maintenanceService.getMaintenances(db),
        staleTime: 30000,
    });

    const { mutate: createMaintenance, isPending: isCreateMaintenanceLoading } = useMutation({
        mutationKey: ["create maintenance"],
        mutationFn: (maintenanceData: ICreateMaintenance) => maintenanceService.createMaintenance(db, maintenanceData),
        onMutate() {
            customToast.loading("create maintenance", "Создание записи обслуживания...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IMaintenance[]>(["maintenances"], (oldData) => {
                if (!oldData) return oldData;
                const data: IMaintenance[] = Array.prototype.concat(newData, oldData);
                return data;
            });
            customToast.success("create maintenance", "Запись обслуживания успешно создана!");
            if (callback) callback();
        },
        onError: () => {
            customToast.error("create maintenance", "Ошибка при создании записи обслуживания");
        }
    });

    const { mutate: updateMaintenance, isPending: isUpdateMaintenanceLoading } = useMutation({
        mutationKey: ["update maintenance"],
        mutationFn: ({ id, maintenanceData }: { id: number; maintenanceData: IUpdateMaintenance }) =>
            maintenanceService.updateMaintenance(db, id, maintenanceData),
        onMutate() {
            customToast.loading("update maintenance", "Обновление записи обслуживания...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IMaintenance[]>(["maintenances"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.map((maintenance) =>
                    maintenance.id == newData[0].id ? newData[0] : maintenance,
                );
                return data;
            });
            customToast.success("update maintenance", "Запись обслуживания успешно обновлена!");
        },
        onError: () => {
            customToast.error("update maintenance", "Ошибка при обновлении записи обслуживания");
        }
    });

    const { mutate: deleteMaintenance, isPending: isDeleteMaintenanceLoading } = useMutation({
        mutationKey: ["delete maintenance"],
        mutationFn: (id: number) => maintenanceService.deleteMaintenance(db, id),
        onMutate() {
            customToast.loading("delete maintenance", "Удаление записи обслуживания...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IMaintenance[]>(["maintenances"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.filter((maintenance) => maintenance.id !== newData[0].id);
                return data;
            });
            customToast.success("delete maintenance", "Запись обслуживания успешно удалена!");
        },
        onError: () => {
            customToast.error("delete maintenance", "Ошибка при удалении записи обслуживания");
        }
    });

    // Дополнительный метод для получения обслуживания по carId
    const useCarMaintenances = (carId: number) => {
        return useQuery({
            queryKey: ["maintenances", "car", carId],
            queryFn: () => maintenanceService.getMaintenancesByCarId(db, carId),
            enabled: !!carId,
        });
    };

    return useMemo(
        () => ({
            maintenances,
            isMaintenancesLoading,
            createMaintenance,
            isCreateMaintenanceLoading,
            updateMaintenance,
            isUpdateMaintenanceLoading,
            deleteMaintenance,
            isDeleteMaintenanceLoading,
            prefetchMaintenances,
            useCarMaintenances
        }),
        [
            maintenances || [],
            isMaintenancesLoading,
            createMaintenance,
            isCreateMaintenanceLoading,
            updateMaintenance,
            isUpdateMaintenanceLoading,
            deleteMaintenance,
            isDeleteMaintenanceLoading,
            prefetchMaintenances
        ],
    );
};