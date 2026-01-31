import { z } from "zod";

export const CreateMemberSchema = z.object({
  firstName: z.string().min(2, "El nombre es muy corto"),
  lastName: z.string().min(2, "El apellido es muy corto"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthDate: z.coerce.date().optional(),
  email: z.email(),
  phone: z
    .string()
    .regex(/^9\d{8}$/, "El teléfono debe tener 9 dígitos y comenzar con 9"),
  docType: z.enum(["DNI", "CE", "PASSPORT"]),
  docNumber: z.string().min(8, "El número de documento es muy corto"),
  isActive: z.boolean().optional(),
});

export const UpdateMemberSchema = CreateMemberSchema.partial().omit({
  docType: true,
  docNumber: true,
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;

export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
