import { API_ENDPOINT } from "../configs/app";
import { request } from "../libs/api/config";
import { ApiResponse } from "../libs/api/types";
import { CustomerModel } from "../model/customer";

export const userService = {
    put: request.put<ApiResponse>(API_ENDPOINT.user.base),
    getCustomers: request.get<ApiResponse<CustomerModel[]>>(API_ENDPOINT.user.customers),
};