import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/UserSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <main>
        <div>
          <SidebarTrigger />
          <ModeToggle />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
