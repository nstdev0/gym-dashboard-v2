import { GetOrganizationUseCase } from "@/server/application/use-cases/organization/get-organization.use-case";
import { ControllerExecutor } from "@/server/lib/api-handler";
import { Organization } from "@/server/domain/entities/Organization";

export class GetOrganizationController implements ControllerExecutor<void, Organization> {
    constructor(private useCase: GetOrganizationUseCase) { }

    async execute(input: void, id?: string) {
        const organization = await this.useCase.execute(id);

        if (!organization) {
            throw new Error("Organization not found");
        }

        return organization;
    }
}
