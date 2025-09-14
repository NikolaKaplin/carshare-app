import { IconDashboard, IconDatabase, IconMoneybag } from "@tabler/icons-react";
import { Car, User, Handshake, Drill } from "lucide-react";

export const DB_TYPE = "sqlite";
export const DB_NAME = "carshare-app.db";
export const DB_PATH = `${DB_TYPE}:${DB_NAME}`;
export const APP_NAME = "carshare-app";

export const data = {
  navMain: [
    {
      title: "Дашборд",
      url: "/",
      icon: IconDashboard,
      queryKey: "",
    },
    {
      title: "Автомобили",
      url: "/cars",
      icon: Car,
      queryKey: "cars",
    },
    {
      title: "Клиенты",
      url: "/clients",
      icon: User,
      queryKey: "clients",
    },
    {
      title: "Аренда и бронирование",
      url: "/bookings",
      icon: Handshake,
      queryKey: "bookings",
    },
    {
      title: "Ремонт и обслуживание",
      url: "/maintenance",
      icon: Drill,
      queryKey: "maintenances",
    },
    {
      title: "Платежи",
      url: "/payments",
      icon: IconMoneybag,
      queryKey: "payments",
    },
    {
      title: "Импорт и экспорт Sqlite",
      url: "/sqlite",
      icon: IconDatabase,
      queryKey: "",
    },
  ],
};

export const about = {};
