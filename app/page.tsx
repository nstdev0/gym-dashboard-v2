import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { LandingPage } from "@/components/landing-page";

export default async function RootPage() {
  // 1. Verificación básica de sesión en Clerk
  const { userId } = await auth();

  // SI NO HAY SESIÓN -> MOSTRAR LANDING
  if (!userId) {
    return <LandingPage />;
  }

  // SI HAY SESIÓN -> LÓGICA DE REDIRECCIÓN

  // 2. Buscar usuario en Base de Datos para ver ROL y ORGANIZACIÓN
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: true, // Traemos la org para obtener el slug
    },
  });

  // --- 3. MANEJO DE LATENCIA (RACE CONDITION) ---
  // Si está logueado en Clerk pero no en DB -> Esperar Webhook
  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500"></div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Sincronizando tu cuenta...
        </p>
        <meta httpEquiv="refresh" content="2" />
      </div>
    );
  }

  return <LandingPage dashboardUrl={user.organization?.slug ? `/${user.organization.slug}/admin/dashboard` : "/sign-in"} isLoggedIn={true} />;
}
