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
import { useTheme } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "../ui/input";

export function NavSecondary() {
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);
  const [isOpenAbout, setIsOpenAbout] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  return (
    <>
      <Dialog open={isOpenSettings} onOpenChange={setIsOpenSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Панель настроек</DialogDescription>
          </DialogHeader>
          {user && (
            <div className="grid grid-cols-2 gap-3">
              <Label>Имя</Label>
              <Input defaultValue={user.username} />
              <Label>Почта</Label>
              <Input defaultValue={user.email} />
            </div>
          )}
          <div className="flex justify-between gap-2 mt-4">
            <Label>Тема</Label>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
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
