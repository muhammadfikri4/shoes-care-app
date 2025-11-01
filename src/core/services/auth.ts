import { API_ENDPOINT } from "@core/configs/app";
import { request } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import {
  AuthLoginDTO,
  AuthLoginModel,
  AuthRegisterDTO,
  CustomerRegisterDTO,
  CustomerRegisterVerifyDTO,
  ForgotPasswordCustomerDTO,
  ResetPasswordCustomerDTO,
} from "@core/model/auth";

export const authService = {
  login: request.post<ApiResponse<AuthLoginModel>, AuthLoginDTO>(
    API_ENDPOINT.auth.login
  ),
  register: request.post<ApiResponse<unknown>, AuthRegisterDTO>(
    API_ENDPOINT.auth.register
  ),
  check: request.get<ApiResponse>(API_ENDPOINT.check),
  refreshToken: request.post<ApiResponse<AuthLoginModel>>(
    API_ENDPOINT.auth.refreshToken
  ),
  customerRegisterStart: request.post<
    ApiResponse<{ ok: boolean }>,
    CustomerRegisterDTO
  >(`${API_ENDPOINT.auth.base}/register/customer`),
  customerRegisterVerify: request.post<
    ApiResponse<{ ok: boolean }>,
    CustomerRegisterVerifyDTO
  >(`${API_ENDPOINT.auth.base}/customer/register/verify`),
  forgotPasswordCustomer: request.post<
    ApiResponse<{ ok: boolean; message: string }>,
    Pick<ForgotPasswordCustomerDTO, 'email'>
  >(`${API_ENDPOINT.auth.base}/forgot-password/customer`),
  resetPasswordCustomer: request.post<
    ApiResponse<{ ok: boolean; message: string }>,
    ResetPasswordCustomerDTO
  >(`${API_ENDPOINT.auth.base}/reset-password/customer`),
};
