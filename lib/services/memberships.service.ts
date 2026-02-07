import { fetchClient } from "@/lib/api-client";
import { CreateMembershipInput, UpdateMembershipInput } from "@/server/application/dtos/memberships.dto";
import { Membership } from "@/server/domain/entities/Membership";
import { PageableResponse } from "@/server/shared/common/pagination";

export interface MembershipWithRelations extends Membership {
    member?: { firstName: string; lastName: string };
    plan?: { name: string };
}

export interface MembershipPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    status?: string;
    [key: string]: any;
}

export class MembershipsService {
    private static readonly BASE_PATH = "/api/memberships";

    static async getAll(params: MembershipPaginationParams = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

        return fetchClient<PageableResponse<MembershipWithRelations>>(endpoint);
    }

    static async getById(id: string) {
        return fetchClient<Membership>(`${this.BASE_PATH}/${id}`);
    }

    static async create(data: CreateMembershipInput) {
        return fetchClient<Membership>(this.BASE_PATH, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static async update(id: string, data: UpdateMembershipInput) {
        return fetchClient<Membership>(`${this.BASE_PATH}/${id}`, {
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
