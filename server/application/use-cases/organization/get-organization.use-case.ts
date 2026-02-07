import { IOrganizationRepository } from "@/server/application/repositories/organizations.repository.interface";
import { Organization } from "@/server/domain/entities/Organization";

export class GetOrganizationUseCase {
    constructor(private readonly repository: IOrganizationRepository) { }

    async execute(id?: string): Promise<Organization | null> {
        if (id) {
            return this.repository.findUnique({ id });
        }
        return this.repository.findCurrent();
    }
}
