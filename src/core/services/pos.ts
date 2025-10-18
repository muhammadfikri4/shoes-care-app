import { API_ENDPOINT } from "@core/configs/app";
import { request } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";

// Racks
export const racksService = {
  list: request.get<ApiResponse<any[]>>(API_ENDPOINT.pos.racks),
  create: request.post<ApiResponse<any>, { code: string; name?: string; location?: string }>(API_ENDPOINT.pos.racks),
  update: (id: string) => request.put<ApiResponse<any>, { code?: string; name?: string; location?: string }>(`${API_ENDPOINT.pos.racks}/${id}`),
  remove: (id: string) => request.delete<ApiResponse<any>>(`${API_ENDPOINT.pos.racks}/${id}`),
};

// Transactions
export const transactionsService = {
  listAll: request.get<ApiResponse<any[]>>(API_ENDPOINT.pos.transactions),
  listMine: request.get<ApiResponse<any[]>>(API_ENDPOINT.pos.transactionsMy),
  create: request.post<ApiResponse<any>, { rackId: string; price: number; customerEmail?: string }>(API_ENDPOINT.pos.transactions),
  scan: request.post<ApiResponse<any>, { qr: string }>(API_ENDPOINT.pos.transactionsScan),
};

// OTP Auth
export const otpAuthService = {
  request: request.post<ApiResponse<any>, { email: string; name?: string }>(API_ENDPOINT.authOtp.request),
  verify: request.post<ApiResponse<any>, { email: string; otp: string }>(API_ENDPOINT.authOtp.verify),
};

