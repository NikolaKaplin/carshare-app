import { customToast } from "@/components/shared/toast-custom";
import { clientsService } from "@/services/clients-service";
import { IClient, ICreateClient, IUpdateClient } from "@/types/client-types";
import { useMutation, usePrefetchQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDatabase } from "tauri-react-sqlite";

export const useClients = (callback?: () => void) => {
    const queryClient = useQueryClient();
    const db = useDatabase();

    const { data: clients, isLoading: isClientsLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () => clientsService.getClients(db),
        refetchInterval: 60000,
    });

    const prefetchClients = usePrefetchQuery({
        queryKey: ['clients'],
        queryFn: () => clientsService.getClients(db),
        staleTime: 30000,
    })

    const { mutate: createClient, isPending: isCreateClientLoading } = useMutation({
        mutationKey: ["create client"],
        mutationFn: (client: ICreateClient) => clientsService.createClient(db, client),
        onMutate() {
            customToast.loading("create client", "Создание клиента...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IClient[]>(["clients"], (oldData) => {
                if (!oldData) return oldData;
                const data: IClient[] = Array.prototype.concat(newData, oldData);
                return data;
            });
            customToast.success("create client", "Клиент успешно создан!");
            if (callback) callback();
        },
    });

    const { mutate: updateClient, isPending: isUpdateClientLoading } = useMutation({
        mutationKey: ["update client"],
        mutationFn: ({ id, client }: { id: number; client: IUpdateClient }) =>
            clientsService.updateClient(db, id, client),
        onMutate() {
            customToast.loading("update client", "Обновление клиента...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IClient[]>(["clients"], (oldData) => {
                if (!oldData) return oldData;
                console.log("new client data: ", newData);
                const data = oldData.map((client) =>
                    client.id == newData[0].id ? newData[0] : client,
                );
                return data;
            });
            customToast.success("update client", "Клиент успешно обновлен!");
        },
    });

    const { mutate: deleteClient, isPending: isDeleteClientLoading } = useMutation({
        mutationKey: ["delete client"],
        mutationFn: (id: number) => clientsService.deleteClient(db, id),
        onMutate() {
            customToast.loading("delete client", "Удаление клиента...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IClient[]>(["clients"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.filter((client) => client.id !== newData[0].id);
                return data;
            });
            customToast.success("delete client", "Клиент успешно удален!");
        },
    });

    return useMemo(
        () => ({
            clients,
            isClientsLoading,
            createClient,
            isCreateClientLoading,
            updateClient,
            isUpdateClientLoading,
            deleteClient,
            isDeleteClientLoading,
            prefetchClients
        }),
        [
            clients || [],
            isClientsLoading,
            createClient,
            isCreateClientLoading,
            updateClient,
            isUpdateClientLoading,
            deleteClient,
            isDeleteClientLoading,
            prefetchClients
        ],
    );
};