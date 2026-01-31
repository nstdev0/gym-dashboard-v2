export interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export interface UpdateOrganizationInput extends Partial<CreateOrganizationInput> {}
