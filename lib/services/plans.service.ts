import { fetchClient } from "@/lib/api-client";
import { CreatePlanInput, UpdatePlanInput } from "@/server/application/dtos/plans.dto";
import { Plan } from "@/server/domain/entities/Plan";
import { PageableResponse } from "@/server/shared/common/pagination";

export interface PlanPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    status?: string;
    [key: string]: any;
}

export class PlansService {
    private static readonly BASE_PATH = "/api/plans";

    static async getAll(params: PlanPaginationParams = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

        return fetchClient<PageableResponse<Plan>>(endpoint);
    }

    static async getById(id: string) {
        return fetchClient<Plan>(`${this.BASE_PATH}/${id}`);
    }

    static async create(data: CreatePlanInput) {
        return fetchClient<Plan>(this.BASE_PATH, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static async update(id: string, data: UpdatePlanInput) {
        return fetchClient<Plan>(`${this.BASE_PATH}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    static async delete(id: string) {
        return fetchClient<void>(`${this.BASE_PATH}/${id}`, {
            method: "DELETE",
        });
    }
}
