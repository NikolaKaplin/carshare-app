import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    email: string;
  };
}) {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar> */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.username}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
          <div
            onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            className="pt-1 h-8 w-8 rounded-lg grayscale"
          >
            {theme == "dark" ? <MoonIcon /> : <SunIcon />}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
