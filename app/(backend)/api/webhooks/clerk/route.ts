import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { Role } from "@/generated/prisma/client";

export async function POST(req: Request) {
  // 1. Verificación de firma
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Falta el CLERK_WEBHOOK_SECRET");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Faltan headers svix", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    return new Response("Error verificando webhook", { status: 400 });
  }

  // 2. Manejo de Eventos
  const eventType = evt.type;
  console.log(`📨 Webhook recibido: ${eventType}`);

  try {
    // PRE-FETCH: Necesitamos el Plan Default disponible para cualquier caso de creación de Org
    // (Ya sea directo o via condición de carrera en membresía)
    const freePlan = await prisma.organizationPlan.findUnique({
      where: { slug: "free-trial" },
    });

    if (!freePlan) {
      // En producción esto debería ser un error silencioso o fallback, pero para dev es crítico
      console.error("❌ ERROR: No existe el plan 'free-trial'. Ejecuta el seed.");
      return new Response("Plan faltante", { status: 500 });
    }

    switch (eventType) {
      // ------------------------------------------------------------------
      // CASO 1: SE CREA LA ORGANIZACIÓN
      // ------------------------------------------------------------------
      case "organization.created": {
        const { id, name, slug, image_url } = evt.data;

        await prisma.$transaction(async (tx) => {
          await tx.organization.upsert({
            where: { id },
            update: {
              name,
              slug: slug || name,
              image: image_url,
              // Si ya existe, no cambiamos el plan, solo datos visuales
            },
            create: {
              id,
              name,
              slug: slug || name,
              image: image_url,
              organizationPlanId: freePlan.id // Usamos el plan recuperado arriba
            },
          });

          const existingSub = await tx.subscription.findUnique({
            where: { organizationId: id }
          });

          if (!existingSub) {
            await tx.subscription.create({
              data: {
                organizationId: id,
                organizationPlanId: freePlan.id,
                status: "TRIALING",
                currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              },
            });
          }
        });

        console.log(`✅ Organización creada/actualizada: ${name}`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 2: SE CREA LA MEMBRESÍA (SOLUCIÓN A RACE CONDITION)
      // ------------------------------------------------------------------
      case "organizationMembership.created": {
        const { organization, public_user_data, role } = evt.data;

        // --- Lógica de Roles ---
        let appRole: Role = Role.STAFF;
        if (role === "org:admin") {
          // Fallback simple: si es admin en Clerk, es Owner o Admin aquí.
          // Para evitar consultas extra complejas en el webhook, podemos asumir Admin
          // y que luego cambien a Owner manualmente o afinar esta lógica después.
          appRole = Role.ADMIN;
        } else if (role === "org:member") {
          appRole = Role.STAFF;
        }

        // --- UPSERT CON CONNECT_OR_CREATE ---
        await prisma.user.upsert({
          where: { id: public_user_data.user_id },
          create: {
            id: public_user_data.user_id,
            email: public_user_data.identifier,
            firstName: public_user_data.first_name || null,
            lastName: public_user_data.last_name || null,
            image: public_user_data.image_url || null,
            role: appRole,
            isActive: true,
            // AQUÍ ESTÁ LA MAGIA:
            organization: {
              connectOrCreate: {
                where: { id: organization.id },
                create: {
                  id: organization.id,
                  name: organization.name,
                  slug: organization.slug || organization.name,
                  image: organization.image_url,
                  organizationPlanId: freePlan.id // Necesario si se crea la org aquí
                }
              }
            }
          },
          update: {
            role: appRole,
            firstName: public_user_data.first_name || undefined,
            lastName: public_user_data.last_name || undefined,
            image: public_user_data.image_url || undefined,
            isActive: true,
            // Aseguramos la conexión también en el update
            organization: {
              connectOrCreate: {
                where: { id: organization.id },
                create: {
                  id: organization.id,
                  name: organization.name,
                  slug: organization.slug || organization.name,
                  image: organization.image_url,
                  organizationPlanId: freePlan.id
                }
              }
            }
          }
        });

        console.log(`✅ Usuario vinculado a org ${organization.name} (Race-condition safe)`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 3: SE ELIMINA LA MEMBRESÍA
      // ------------------------------------------------------------------
      case "organizationMembership.deleted": {
        const { public_user_data } = evt.data;
        await prisma.user.update({
          where: { id: public_user_data.user_id },
          data: { organizationId: null, isActive: false }
        });
        console.log(`🔓 Usuario desvinculado`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 4: SE ACTUALIZA LA ORGANIZACIÓN
      // ------------------------------------------------------------------
      case "organization.updated": {
        const { id, name, slug, image_url } = evt.data;
        // Solo intentamos actualizar si existe, si no, ignoramos (evitar errores 404 raros)
        try {
          await prisma.organization.update({
            where: { id },
            data: { name, slug: slug || undefined, image: image_url || undefined }
          });
          console.log(`🔄 Organización actualizada: ${name}`);
        } catch (error) {
          console.log("⚠️ Intento de actualizar organización no existente (ignorado)");
        }
        break;
      }

      default:
        console.log(`⏭️ Evento no manejado: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    // Retornamos 500 para que Clerk reintente luego si fue un error de DB temporal
    return NextResponse.json({ success: false, error: "Fallo interno" }, { status: 500 });
  }
}