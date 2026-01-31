// app/(frontend)/system/layout.tsx

import { SystemSidebar } from "@/components/system/sidebar";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

// ... imports

export default async function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    console.log("❌ SystemLayout: No userId found in session");
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // --- DEBUG LOGS (Remove later) ---
  console.log("🔍 SYSTEM ACCESS CHECK:");
  console.log("👉 Clerk User ID:", userId);
  console.log("👉 DB User Found:", user);
  console.log("👉 Role in DB:", user?.role);
  console.log("👉 Match Condition:", user?.role === "SUPER_ADMIN");
  // --------------------------------

  if (user?.role !== "SUPER_ADMIN") {
    console.log("⛔ Access Denied: User is not SUPER_ADMIN");
    return notFound();
  }

  return (
    // ... your JSX
    <div className="flex h-screen bg-slate-950 text-white">
      <SystemSidebar />{" "}
      {/* Menú: "Gimnasios", "Planes Globales", "Facturación SaaS" */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-900">
        {children}
      </main>
    </div>
  );
}
