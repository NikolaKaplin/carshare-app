import { IconDashboard, IconSettings, IconHelp, IconSearch, IconDatabase, IconMoneybag } from "@tabler/icons-react";
import { Car, User, Handshake, Drill } from "lucide-react";

export const data = {
    navMain: [
        {
            title: "Дашборд",
            url: "/",
            icon: IconDashboard,
            queryKey: ""
        },
        {
            title: "Автомобили",
            url: "/cars",
            icon: Car,
            queryKey: "cars"
        },
        {
            title: "Клиенты",
            url: "/clients",
            icon: User,
            queryKey: "clients"
        },
        {
            title: "Аренда и бронирование",
            url: "/bookings",
            icon: Handshake,
            queryKey: "bookings"
        },
        {
            title: "Ремонт и обслуживание",
            url: '/maintenance',
            icon: Drill,
            queryKey: "maintenances"
        },
        {
            title: "Платежи",
            url: "/payments",
            icon: IconMoneybag,
            queryKey: "payments"
        },
        {
            title: "Импорт и экспорт Sqlite",
            url: "/sqlite",
            icon: IconDatabase,
            queryKey: ""
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
};