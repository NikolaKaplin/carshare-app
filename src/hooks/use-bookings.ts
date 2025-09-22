import { customToast } from "@/components/shared/toast-custom";
import { bookingsService } from "@/services/bookings-service";
import { IBooking, ICreateBooking, IUpdateBooking } from "@/types/bookings-types";
import { useMutation, usePrefetchQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDatabase } from "tauri-react-sqlite";

export const useBookings = (callback?: () => void) => {
    const queryClient = useQueryClient();
    const db = useDatabase();

    const { data: bookings, isLoading: isBookingsLoading } = useQuery({
        queryKey: ["bookings"],
        queryFn: () => bookingsService.getBookings(db),
        refetchInterval: 60000,
    });

    const prefetchBookings = usePrefetchQuery({
        queryKey: ['bookings'],
        queryFn: () => bookingsService.getBookings(db),
        staleTime: 60000,
    })

    const { mutate: createBooking, isPending: isCreateBookingLoading } = useMutation({
        mutationKey: ["create booking"],
        mutationFn: (booking: ICreateBooking) => bookingsService.createBooking(db, booking),
        onMutate() {
            customToast.loading("create booking", "Создание бронирования...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IBooking[]>(["bookings"], (oldData) => {
                if (!oldData) return oldData;
                const data: IBooking[] = Array.prototype.concat(newData, oldData);
                return data;
            });
            customToast.success("create booking", "Бронирование успешно создано!");
            if (callback) callback();
        },
    });

    const { mutate: updateBooking, isPending: isUpdateBookingLoading } = useMutation({
        mutationKey: ["update booking"],
        mutationFn: ({ id, booking }: { id: number; booking: IUpdateBooking }) =>
            bookingsService.updateBooking(db, id, booking),
        onMutate() {
            customToast.loading("update booking", "Обновление бронирования...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IBooking[]>(["bookings"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.map((booking) =>
                    booking.id == newData[0].id ? newData[0] : booking,
                );
                return data;
            });
            customToast.success("update booking", "Бронирование успешно обновлено!");
        },
    });

    const { mutate: deleteBooking, isPending: isDeleteBookingLoading } = useMutation({
        mutationKey: ["delete booking"],
        mutationFn: (id: number) => bookingsService.deleteBooking(db, id),
        onMutate() {
            customToast.loading("delete booking", "Удаление бронирования...");
        },
        onSuccess: (newData) => {
            queryClient.setQueryData<IBooking[]>(["bookings"], (oldData) => {
                if (!oldData) return oldData;
                const data = oldData.filter((booking) => booking.id !== newData[0].id);
                return data;
            });
            customToast.success("delete booking", "Бронирование успешно удалено!");
        },
    });

    return useMemo(
        () => ({
            bookings,
            isBookingsLoading,
            createBooking,
            isCreateBookingLoading,
            updateBooking,
            isUpdateBookingLoading,
            deleteBooking,
            isDeleteBookingLoading,
            prefetchBookings
        }),
        [
            bookings || [],
            isBookingsLoading,
            createBooking,
            isCreateBookingLoading,
            updateBooking,
            isUpdateBookingLoading,
            deleteBooking,
            isDeleteBookingLoading,
            prefetchBookings
        ],
    );
};