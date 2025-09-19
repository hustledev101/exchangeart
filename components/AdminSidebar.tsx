"use client";
import {
  History,
  Home,
  Image,
  LogOut,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { clearAdminSession } from "@/lib/localStorageUtils";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/admin/overview",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },

  {
    title: "Users Transactions",
    url: "/admin/transactions",
    icon: History,
  },

  {
    title: "Users Collection",
    url: "/admin/userscollections",
    icon: Image,
  },
  {
    title: "Wallet",
    url: "/admin/wallet",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AdminSidebar() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    clearAdminSession();
    router.push("/auth/admin/login");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.title === "Logout" ? (
                      <a href={item.url} onClick={handleLogout}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
