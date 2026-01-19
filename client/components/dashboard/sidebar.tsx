"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Sidebar({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: "📊", id: "dashboard", href: "/dashboard" },
    {
      label: "Projects",
      icon: "📁",
      id: "projects",
      href: "/dashboard/projects",
    },
    { label: "Tasks", icon: "✓", id: "tasks", href: "/dashboard/tasks" },
    { label: "Team", icon: "👥", id: "team", href: "/dashboard/team" },
    {
      label: "Settings",
      icon: "⚙️",
      id: "settings",
      href: "/dashboard/settings",
    },
  ];

  const isActive = (href: string) => {
    return (
      pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
    );
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          ProjectHub
        </h1>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-sidebar-border space-y-4">
        <Card className="p-4 bg-sidebar-accent/10">
          <p className="text-sm text-sidebar-foreground mb-1 font-semibold">
            {user?.name}
          </p>
          <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
        </Card>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-transparent"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
