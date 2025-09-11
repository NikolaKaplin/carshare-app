import { data } from "@/lib/constants";
import { carsService } from "@/services/cars.sevice";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useDatabase } from "tauri-react-sqlite";
import { SidebarMenuButton } from "../ui/sidebar";
import { Icon } from "@tabler/icons-react";

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
  const { db } = useDatabase();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: [item.queryKey],
      queryFn: () => {
        switch (item.url) {
          case "/cars":
            return carsService.getCars(db);
          default:
            return Promise.resolve([]);
        }
      },
      staleTime: 60000,
    });
  };

  return (
    <div onFocus={prefetch} onMouseEnter={prefetch}>
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
