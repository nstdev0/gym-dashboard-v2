import z from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>;
