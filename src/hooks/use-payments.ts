import { customToast } from "@/components/shared/toast-custom";
import { paymentsService } from "@/services/payments.service";
import { IPayment, ICreatePayment, IUpdatePayment } from "@/types/payments-types";
import { useMutation, usePrefetchQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDatabase } from "tauri-react-sqlite";

export const usePayments = (callback?: () => void) => {
    const queryClient = useQueryClient();
    const db = useDatabase();

    const { data: payments, isLoading: isPaymentsLoading } = useQuery({
        queryKey: ["payments"],
        queryFn: () => paymentsService.getPayments(db),
        refetchInterval: 60000,
    });

    const prefetchPayments = usePrefetchQuery({
        queryKey: ['payments'],
        queryFn: () => paymentsService.getPayments(db),
        staleTime: 30000,
    });

    const { mutate: createPayment, isPending: isCreatePaymentLoading } = useMutation({
        mutationKey: ["create payment"],
        mutationFn: (paymentData: ICreatePayment) => paymentsService.createPayment(db, paymentData),
        onMutate() {
            customToast.loading("create payment", "Создание платежа...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IPayment[]>(["payments"], (oldData) => {
                if (!oldData) return oldData;
                const data: IPayment[] = Array.prototype.concat(newData, oldData);
                return data;
            });
            customToast.success("create payment", "Платеж успешно создан!");
            if (callback) callback();
        },
        onError: () => {
            customToast.error("create payment", "Ошибка при создании платежа");
        }
    });

    const { mutate: updatePayment, isPending: isUpdatePaymentLoading } = useMutation({
        mutationKey: ["update payment"],
        mutationFn: ({ id, paymentData }: { id: number; paymentData: IUpdatePayment }) =>
            paymentsService.updatePayment(db, id, paymentData),
        onMutate() {
            customToast.loading("update payment", "Обновление платежа...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IPayment[]>(["payments"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.map((payment) =>
                    payment.id == newData[0].id ? newData[0] : payment,
                );
                return data;
            });
            customToast.success("update payment", "Платеж успешно обновлен!");
        },
        onError: () => {
            customToast.error("update payment", "Ошибка при обновлении платежа");
        }
    });

    const { mutate: deletePayment, isPending: isDeletePaymentLoading } = useMutation({
        mutationKey: ["delete payment"],
        mutationFn: (id: number) => paymentsService.deletePayment(db, id),
        onMutate() {
            customToast.loading("delete payment", "Удаление платежа...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IPayment[]>(["payments"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.filter((payment) => payment.id !== newData[0].id);
                return data;
            });
            customToast.success("delete payment", "Платеж успешно удален!");
        },
        onError: () => {
            customToast.error("delete payment", "Ошибка при удалении платежа");
        }
    });


    return useMemo(
        () => ({
            payments,
            isPaymentsLoading,
            createPayment,
            isCreatePaymentLoading,
            updatePayment,
            isUpdatePaymentLoading,
            deletePayment,
            isDeletePaymentLoading,
            prefetchPayments,
        }),
        [
            payments || [],
            isPaymentsLoading,
            createPayment,
            isCreatePaymentLoading,
            updatePayment,
            isUpdatePaymentLoading,
            deletePayment,
            isDeletePaymentLoading,
            prefetchPayments
        ],
    );
};