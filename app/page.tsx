import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/server/infrastructure/persistence/prisma";

export default async function RootPage() {
  // 1. Verificación básica de sesión en Clerk
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Buscar usuario en Base de Datos para ver ROL y ORGANIZACIÓN
  // No confiamos solo en la cookie de Clerk, necesitamos el slug actualizado de la DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: true, // Traemos la org para obtener el slug
    },
  });

  // --- 3. MANEJO DE LATENCIA (RACE CONDITION) ---
  // Si el usuario existe en Clerk pero el Webhook aún no lo ha creado en Postgres.
  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        {/* Spinner simple con Tailwind */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Sincronizando tu cuenta...
        </p>
        {/* Auto-recarga la página cada 2 segundos hasta que el usuario aparezca */}
        <meta httpEquiv="refresh" content="2" />
      </div>
    );
  }

  // --- 4. ENRUTAMIENTO INTELIGENTE ---

  // CASO A: Es el Dueño del Sistema (Super Admin)
  if (user.role === "SUPER_ADMIN") {
    redirect("/system/dashboard");
  }

  // CASO B: Es un usuario normal CON organización
  if (user.organization) {
    redirect(`/${user.organization.slug}/admin/dashboard`);
  }

  // CASO C: Usuario huérfano (Registrado, pero sin organización)
  // Aquí decides: ¿Lo mandas a crear una? ¿Le muestras un mensaje?
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-white">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Hola, {user.email}
        </h1>
        <p className="text-gray-500">
          Tu cuenta está activa, pero no perteneces a ninguna organización.
        </p>
      </div>

      {/* Opcional: Botón para contactar soporte o crear org si permites self-service */}
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
        Contacta a un administrador para que te invite a un gimnasio.
      </div>
    </div>
  );
}
