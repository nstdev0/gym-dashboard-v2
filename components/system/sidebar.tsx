"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs"; // <--- 1. Importar hook
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export function SystemSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk(); // <--- 2. Obtener función signOut

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/system/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Organizaciones",
      icon: Building2,
      href: "/system/organizations",
      color: "text-violet-500",
    },
    {
      label: "Usuarios Globales",
      icon: Users,
      href: "/system/users",
      color: "text-pink-700",
    },
    {
      label: "Configuración SaaS",
      icon: Settings,
      href: "/system/settings",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-950 text-white w-64 border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/system/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <ShieldAlert className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-xl font-bold">
            Gym<span className="text-indigo-500">SaaS</span>
            <span className="text-xs ml-1 text-slate-500 block font-normal">
              GOD MODE
            </span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        {/* 3. Conectar el evento onClick */}
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </div>
        </button>
      </div>
    </div>
  );
}
