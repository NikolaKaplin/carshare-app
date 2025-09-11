import { customToast } from "@/components/shared/toast-custom";
import { carsService } from "@/services/cars.sevice";
import { ICar, ICreateCar, IUpdateCar } from "@/types/cars-types";
import { useMutation, usePrefetchQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDatabase } from "tauri-react-sqlite";

export const useCars = (callback: () => void) => {
  const queryClient = useQueryClient();
  const db = useDatabase();

  const { data: cars, isLoading: isCarsLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: () => carsService.getCars(db),
    refetchInterval: 120000,
  });

  const prefetchCars = usePrefetchQuery({
    queryKey: ['cars'],
    queryFn: () => carsService.getCars(db),
    staleTime: 60000,
  })

  const { mutate: createCar, isPending: isCreateCarLoading } = useMutation({
    mutationKey: ["create car"],
    mutationFn: (car: ICreateCar) => carsService.createCar(db, car),
    onMutate() {
      customToast.loading("create car", "Создание автомобиля...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<ICar[]>(["cars"], (oldData) => {
        if (!oldData) return oldData;
        const data: ICar[] = Array.prototype.concat(newData, oldData);
        return data;
      });
      customToast.success("create car", "Автомобиль успешно создан!");
      if (callback) callback();
    },
  });

  const { mutate: updateCar, isPending: isUpdateCarLoading } = useMutation({
    mutationKey: ["update car"],
    mutationFn: ({ id, car }: { id: number; car: IUpdateCar }) =>
      carsService.updateCar(db, id, car),
    onMutate() {
      customToast.loading("update car", "Обновление автомобиля...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<ICar[]>(["cars"], (oldData) => {
        if (!oldData) return oldData;
        console.log("new car data: ", newData);
        const data = oldData.map((car) =>
          car.id == newData[0].id ? newData[0] : car,
        );
        return data;
      });
      customToast.success("update car", "Автомобиль успешно обновлен!");
    },
  });

  const { mutate: deleteCar, isPending: isDeleteCarLoading } = useMutation({
    mutationKey: ["delete car"],
    mutationFn: (id: number) => carsService.deleteCar(db, id),
    onMutate() {
      customToast.loading("delete car", "Удаление автомобиля...");
    },
    onSuccess: (newData) => {
      queryClient.setQueryData<ICar[]>(["cars"], (oldData) => {
        if (!oldData) return oldData;
        const data = oldData.filter((car) => car.id !== newData[0].id);
        return data;
      });
      customToast.success("delete car", "Автомобиль успешно удален!");
    },
  });

  return useMemo(
    () => ({
      cars,
      isCarsLoading,
      createCar,
      isCreateCarLoading,
      updateCar,
      isUpdateCarLoading,
      deleteCar,
      isDeleteCarLoading,
      prefetchCars
    }),
    [
      cars || [],
      isCarsLoading,
      createCar,
      isCreateCarLoading,
      updateCar,
      isUpdateCarLoading,
      deleteCar,
      isDeleteCarLoading,
      prefetchCars
    ],
  );
};
