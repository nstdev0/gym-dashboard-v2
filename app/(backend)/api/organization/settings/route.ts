
import { UpdateOrganizationSettingsController } from "@/server/interface-adapters/controllers/organization/update-organization-settings.controller";
import { UpdateOrganizationSettingsUseCase } from "@/server/application/use-cases/organization/update-organization-settings.use-case";

const updateUseCase = new UpdateOrganizationSettingsUseCase();
const updateController = new UpdateOrganizationSettingsController(updateUseCase);

import { GetOrganizationController } from "@/server/interface-adapters/controllers/organization/get-organization.controller";
import { GetOrganizationUseCase } from "@/server/application/use-cases/organization/get-organization.use-case";

const getUseCase = new GetOrganizationUseCase();
const getController = new GetOrganizationController(getUseCase);

export async function GET(req: Request) {
    return getController.execute(req);
}

export async function PATCH(req: Request) {
    return updateController.execute(req);
}
