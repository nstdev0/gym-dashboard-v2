import { fetchClient } from "@/lib/api-client";
import { CreateUserInput, UpdateUserInput } from "@/server/application/dtos/users.dto";
import { User } from "@/server/domain/entities/User";
import { PageableResponse } from "@/server/shared/common/pagination";

export interface UserPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    status?: string;
    [key: string]: any;
}

export class UsersService {
    private static readonly BASE_PATH = "/api/users";

    static async getAll(params: UserPaginationParams = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

        return fetchClient<PageableResponse<User>>(endpoint);
    }

    static async getById(id: string) {
        return fetchClient<User>(`${this.BASE_PATH}/${id}`);
    }

    static async create(data: CreateUserInput) {
        return fetchClient<User>(this.BASE_PATH, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static async update(id: string, data: UpdateUserInput) {
        return fetchClient<User>(`${this.BASE_PATH}/${id}`, {
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
