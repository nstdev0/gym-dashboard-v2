import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

  // --- 4. ENRUTAMIENTO AUTOMÁTICO ---
  // Si el usuario ya tiene su "casa", lo mandamos directo.

  // CASO A: Es el Dueño del Sistema (God Mode)
  if (user.role === "GOD") {
    redirect("/system/dashboard");
  }

  // CASO B: Usuario con Organización
  if (user.organization) {
    redirect(`/${user.organization.slug}/admin/dashboard`);
  }

  // CASO C: Usuario sin organización (Orphan)
  // Mostramos la Landing Page. El botón "Ir al Dashboard" (o iniciar sesión)
  // manejará el resto, o Clerk interceptará si intentan acceder a rutas protegidas.
  // Podríamos redirigir a /sign-up para forzar creación de org, pero mejor dejar que elijan.

  let dashboardUrl = "/sign-in";
  if (user) {
    // Si está logueado pero no tiene org, el botón podría llevar al portal de usuario de Clerk
    // o a una página explicativa. Por ahora, dejamos que vaya al sign-in 
    // o manejamos el dashboardUrl como un falback.
    // Sencillamente mostramos la landing, el componente LandingPage decidirá qué botón mostrar.
    // Pero necesitamos pasarle un URL válido si queremos que el botón "Ir al Dashboard" haga algo útil.
    // Si no tiene org, tal vez queramos que cree una.
    dashboardUrl = "/sign-up"; // Esto disparará el flujo de Clerk
  }

  return <LandingPage dashboardUrl={dashboardUrl} isLoggedIn={true} />;
}
