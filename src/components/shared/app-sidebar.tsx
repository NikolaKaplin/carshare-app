import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "@/components/shared/nav-main";
import { NavSecondary } from "@/components//shared/nav-secondary";
import { NavUser } from "@/components/shared/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthorized } from "@/contexts/AuthContext";
import { data } from "@/lib/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthorized();
  return (
    <>
      {user && (
        <Sidebar collapsible="offcanvas" {...props}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className="hover:cursor-default ">
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-sidebar active:bg-sidebar"
                >
                  <div className="mt-8">
                    <IconInnerShadowTop className="!size-5" />
                    <span className="text-base font-semibold flex">
                      <p className="font-bold">belka</p>
                      <p className="font-light">Car</p>
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <NavMain
              //@ts-ignore
              items={data.navMain}
            />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}
