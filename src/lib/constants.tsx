import { IconDashboard, IconDatabase, IconMoneybag } from "@tabler/icons-react";
import { Car, User, Handshake, Drill, DatabaseBackup, PointerIcon, CarFrontIcon, MessageCircleCode } from "lucide-react";

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
      title: "Бэкапы",
      url: "/backups",
      icon: DatabaseBackup,
      queryKey: "backups",
    },
    {
      title: "Филиалы",
      url: "/points",
      icon: PointerIcon,
      queryKey: "backups",
    },
    {
      title: "Угоны",
      url: "/hijacking",
      icon: CarFrontIcon,
      queryKey: "hijacking",
    },
    {
      title: "Комментраии",
      url: "/comments",
      icon: MessageCircleCode,
      queryKey: "comments",
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
