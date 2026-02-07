import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  planSlug: z.string().optional(),
});

export const UpdateOrganizationSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().optional(),
  settings: z.object({
    general: z.object({
      currency: z.string().default("PEN"),
    }).optional(),
    operations: z.object({
      gracePeriodDays: z.number().int().min(0).default(5),
      maxCapacity: z.number().int().min(1).default(100),
      requireCheckInApproval: z.boolean().default(false),
    }).optional(),
    notifications: z.object({
      emailAlerts: z.boolean().default(true),
      smsAlerts: z.boolean().default(false),
    }).optional(),
  }).optional(),
});

export type UpdateOrganizationSettingsInput = z.infer<typeof UpdateOrganizationSettingsSchema>;


export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

export const UpdateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationSchema = z.infer<typeof UpdateOrganizationSchema>;
