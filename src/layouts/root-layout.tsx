import { useEffect, useState } from "react";
import { Minimize2, Maximize2, X, Square } from "lucide-react";
import { Outlet } from "react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";

const RootLayout = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const initializeWindowState = async () => {
      try {
        const appWindow = getCurrentWindow();
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error("Error getting window state:", error);
      }
    };

    initializeWindowState();
  }, []);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const initializeTitlebar = async () => {
      try {
        const minimizeBtn = document.getElementById("titlebar-minimize");
        const maximizeBtn = document.getElementById("titlebar-maximize");
        const closeBtn = document.getElementById("titlebar-close");

        if (!minimizeBtn || !maximizeBtn || !closeBtn) {
          console.error("Titlebar buttons not found");
          return;
        }

        minimizeBtn.replaceWith(minimizeBtn.cloneNode(true));
        maximizeBtn.replaceWith(maximizeBtn.cloneNode(true));
        closeBtn.replaceWith(closeBtn.cloneNode(true));

        const newMinimizeBtn = document.getElementById("titlebar-minimize")!;
        const newMaximizeBtn = document.getElementById("titlebar-maximize")!;
        const newCloseBtn = document.getElementById("titlebar-close")!;

        newMinimizeBtn.addEventListener("click", async () => {
          try {
            await appWindow.minimize();
          } catch (error) {
            console.error("Error minimizing window:", error);
          }
        });

        newMaximizeBtn.addEventListener("click", async () => {
          try {
            await appWindow.toggleMaximize();
            setTimeout(async () => {
              const maximized = await appWindow.isMaximized();
              setIsMaximized(maximized);
            }, 100);
          } catch (error) {
            console.error("Error toggling maximize:", error);
          }
        });

        newCloseBtn.addEventListener("click", async () => {
          try {
            await appWindow.close();
          } catch (error) {
            console.error("Error closing window:", error);
          }
        });
      } catch (error) {
        console.error("Error initializing titlebar:", error);
      }
    };

    setTimeout(initializeTitlebar, 100);
  }, []);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const unlisten = appWindow.onResized(async () => {
      try {
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error("Error checking window state on resize:", error);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Titlebar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-8 bg-card border-b border-border/40 backdrop-blur-sm supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center justify-between h-full px-2">
            {/* Draggable area */}
            <div
              data-tauri-drag-region
              className="flex-1 h-full cursor-grab active:cursor-grabbing"
            />

            {/* Window controls */}
            <div className="flex items-center space-x-1">
              <button
                id="titlebar-minimize"
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-200"
                title="Minimize"
              >
                <Minimize2 size={14} />
              </button>

              <button
                id="titlebar-maximize"
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-200"
                title={"Maximize"}
              >
                <Square size={12} />
              </button>

              <button
                id="titlebar-close"
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8 h-full no-scrollbar overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
