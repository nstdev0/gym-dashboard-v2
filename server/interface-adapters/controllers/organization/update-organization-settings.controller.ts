
import { NextResponse } from "next/server";
import { UpdateOrganizationSettingsUseCase } from "@/server/application/use-cases/organization/update-organization-settings.use-case";
import { auth } from "@clerk/nextjs/server";
import { UpdateOrganizationSettingsSchema } from "@/server/application/dtos/organizations.dto";

export class UpdateOrganizationSettingsController {
    constructor(private useCase: UpdateOrganizationSettingsUseCase) { }

    async handle(req: Request) {
        try {
            const { userId, orgId } = await auth();

            if (!userId || !orgId) {
                return new NextResponse("Unauthorized", { status: 401 });
            }

            // Read body
            const body = await req.json();

            // Validate
            const validationResult = UpdateOrganizationSettingsSchema.safeParse(body);

            if (!validationResult.success) {
                return NextResponse.json(
                    { error: "Validation failed", details: validationResult.error.flatten() },
                    { status: 400 }
                );
            }

            const input = validationResult.data;

            // Execute
            const updatedOrg = await this.useCase.execute(orgId, input);

            return NextResponse.json(updatedOrg);
        } catch (error) {
            console.error("[UPDATE_ORG_SETTINGS] Error:", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }
}
