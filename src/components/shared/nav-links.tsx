import { carsService } from "@/services/cars-sevice";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useDatabase } from "tauri-react-sqlite";
import { SidebarMenuButton } from "../ui/sidebar";
import { Icon } from "@tabler/icons-react";
import { clientsService } from "@/services/clients-service";
import { bookingsService } from "@/services/bookings-service";
import { maintenanceService } from "@/services/maintenance-service";
import { paymentsService } from "@/services/payments-service";

function NavLinkPrefetch({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon: Icon;
    queryKey: string;
  };
}) {
  const queryClient = useQueryClient();
  const db = useDatabase();

  function qf(url: string): any {
    switch (url) {
      case "/cars":
        return carsService.getCars(db);
      case "/clients":
        return clientsService.getClients(db);
      case "/bookings":
        return bookingsService.getBookings(db);
      case "/maintenance":
        return maintenanceService.getMaintenances(db);
      case "/payments":
        return paymentsService.getPayments(db);
      default:
        return Promise.resolve([]);
    }
  }

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: [item.queryKey],
      queryFn: () => qf(item.url),
      staleTime: 30000,
    });
  };

  return (
    <div
      onFocus={prefetch}
      onMouseEnter={() => {
        console.log("prefetch");
        prefetch();
      }}
    >
      <Link to={item.url}>
        <SidebarMenuButton tooltip={item.title}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </div>
  );
}

export default NavLinkPrefetch;
