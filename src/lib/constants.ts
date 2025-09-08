import { IconDashboard, IconSettings, IconHelp, IconSearch, IconDatabase, IconMoneybag } from "@tabler/icons-react";
import { Car, User, Handshake } from "lucide-react";

export const data = {
    navMain: [
        {
            title: "Дашборд",
            url: "/",
            icon: IconDashboard,
        },
        {
            title: "Автомобили",
            url: "/cars",
            icon: Car,
        },
        {
            title: "Клиенты",
            url: "/clients",
            icon: User,
        },
        {
            title: "Аренда и бронирование",
            url: "/rent",
            icon: Handshake,
        },
        {
            title: "Платежи",
            url: "/payments",
            icon: IconMoneybag,
        },
        {
            title: "Импорт и экспорт Sqlite",
            url: "/sqlite",
            icon: IconDatabase,
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