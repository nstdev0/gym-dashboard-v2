import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { Role } from "@/generated/prisma/client";

export async function POST(req: Request) {
  // 1. Verificación de firma (Boilerplate estándar de Clerk)
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
  } catch (err) {
    return new Response("Error verificando webhook", { status: 400 });
  }

  // 2. Manejo de Eventos
  const eventType = evt.type;

  console.log(`📨 Webhook recibido: ${eventType}`);

  try {
    switch (eventType) {
      // ------------------------------------------------------------------
      // CASO 1: SE CREA LA ORGANIZACIÓN
      // ------------------------------------------------------------------
      case "organization.created": {
        const { id, name, slug, image_url, created_by } = evt.data;

        const freePlan = await prisma.organizationPlan.findUnique({
          where: { slug: "free-trial" },
        });

        if (!freePlan) {
          console.error("❌ ERROR CRÍTICO: No existe el plan 'free-trial' en la DB.");
          return new Response("Plan not found", { status: 500 });
        }

        // Transacción: Crear Org + Subscription (idempotente con upsert)
        await prisma.$transaction(async (tx) => {
          // A. Crear/Actualizar Organización
          await tx.organization.upsert({
            where: { id },
            update: {
              name,
              slug: slug || name,
              image: image_url,
              organizationPlanId: freePlan.id
            },
            create: {
              id,
              name,
              slug: slug || name,
              image: image_url,
              organizationPlanId: freePlan.id
            },
          });

          // B. Crear Subscription si no existe
          const existingSub = await tx.subscription.findUnique({
            where: { organizationId: id }
          });

          if (!existingSub) {
            await tx.subscription.create({
              data: {
                organizationId: id,
                organizationPlanId: freePlan.id,
                status: "TRIALING",
                currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días trial
              },
            });
          }
        });

        console.log(`✅ Organización creada: ${name} (${slug})`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 2: SE CREA LA MEMBRESÍA (Usuario se une a Organización)
      // ------------------------------------------------------------------
      case "organizationMembership.created": {
        const { organization, public_user_data, role } = evt.data;

        // Mapear rol de Clerk a nuestro enum
        // Clerk usa: "org:admin", "org:member", o roles custom
        // El creador de la org tiene role = "org:admin" automáticamente
        let appRole: Role = Role.STAFF; // Default

        if (role === "org:admin") {
          // Verificar si es el creador (Owner) o un admin invitado
          const org = await prisma.organization.findUnique({
            where: { id: organization.id },
            select: { createdAt: true }
          });

          // Si la org se creó hace menos de 1 minuto, probablemente es el creador
          const isCreator = org && (Date.now() - org.createdAt.getTime() < 60000);
          appRole = isCreator ? Role.OWNER : Role.ADMIN;
        } else if (role === "org:member") {
          appRole = Role.STAFF;
        } else {
          // Roles custom: "org:trainer", "org:god", etc.
          const customRole = role?.replace("org:", "").toUpperCase();
          if (customRole && Object.values(Role).includes(customRole as Role)) {
            appRole = customRole as Role;
          }
        }

        // Upsert para idempotencia (Clerk puede reintentar eventos)
        await prisma.user.upsert({
          where: { id: public_user_data.user_id },
          create: {
            id: public_user_data.user_id,
            organizationId: organization.id,
            role: appRole,
            firstName: public_user_data.first_name || null,
            lastName: public_user_data.last_name || null,
            image: public_user_data.image_url || null,
            email: public_user_data.identifier, // ✅ El email está aquí, no en public_metadata
            isActive: true,
          },
          update: {
            organizationId: organization.id,
            role: appRole,
            firstName: public_user_data.first_name || undefined,
            lastName: public_user_data.last_name || undefined,
            image: public_user_data.image_url || undefined,
            isActive: true,
          }
        });

        console.log(`✅ Usuario ${public_user_data.identifier} vinculado a org ${organization.id} como ${appRole}`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 3: SE ELIMINA LA MEMBRESÍA (Usuario deja la organización)
      // ------------------------------------------------------------------
      case "organizationMembership.deleted": {
        const { public_user_data } = evt.data;

        await prisma.user.update({
          where: { id: public_user_data.user_id },
          data: {
            organizationId: null,
            isActive: false,
          }
        });

        console.log(`🔓 Usuario ${public_user_data.identifier} desvinculado de organización`);
        break;
      }

      // ------------------------------------------------------------------
      // CASO 4: SE ACTUALIZA LA ORGANIZACIÓN
      // ------------------------------------------------------------------
      case "organization.updated": {
        const { id, name, slug, image_url } = evt.data;

        await prisma.organization.update({
          where: { id },
          data: {
            name,
            slug: slug || undefined,
            image: image_url || undefined,
          }
        });

        console.log(`🔄 Organización actualizada: ${name}`);
        break;
      }

      default:
        console.log(`⏭️ Evento no manejado: ${eventType}`);
    }

    return NextResponse.json({ success: true, message: "Webhook procesado" });
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json({ success: false, error: "Fallo interno" }, { status: 500 });
  }
}