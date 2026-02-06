import { z } from "zod";
import { MembershipStatus } from "@/generated/prisma/client";

export const createMembershipSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.nativeEnum(MembershipStatus).optional().default("PENDING"),
  pricePaid: z.coerce.number().min(0),
  memberId: z.string().min(1, "Miembro requerido"),
  planId: z.string().min(1, "Plan requerido"),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;

export const UpdateMembershipSchema = createMembershipSchema.partial();

export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;
