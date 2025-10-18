import { API_ENDPOINT } from "../configs/app";
import { request } from "../libs/api/config";
import { ApiResponse } from "../libs/api/types";

export const userService = {
    put: request.put<ApiResponse>(API_ENDPOINT.user.base),
};