import { IconHelp, IconSettings } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ThemeToggle } from "./theme-toggle";
import { ColorThemeSelector } from "./color-scheme-selector";

export function NavSecondary() {
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
  const [isOpenAbout, setIsOpenAbout] = useState<boolean>(false);
  return (
    <>
      <Dialog open={isOpenSettings} onOpenChange={setIsOpenSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Панель настроек</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4"></div>
          <Label>Темы</Label>
          <div className="grid gap-2">
            <Label htmlFor="theme">Цветовая тема</Label>
            <ThemeToggle />
            <ColorThemeSelector />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenAbout} onOpenChange={setIsOpenAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>АО BelkaCar</DialogTitle>
            <DialogDescription>
              BelkaCar — каршеринговый сервис, предоставляющий услуги
              краткосрочной аренды автомобилей через мобильное приложение в
              Москве, Сочи, Краснодарском крае, Санкт-Петербурге. Сервис также
              представлен в Казани и Калининграде — здесь только долгосрочные
              аренды. Входит в четвёрку крупнейших каршеринговых сервисов
              России.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4"></div>
        </DialogContent>
      </Dialog>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              key={"setings"}
              onClick={() => setIsOpenSettings(true)}
            >
              <SidebarMenuButton>
                <IconSettings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key={"about"} onClick={() => setIsOpenAbout(true)}>
              <SidebarMenuButton>
                <IconHelp />
                <span>About</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
