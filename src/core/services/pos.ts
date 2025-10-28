import { API_ENDPOINT } from "@core/configs/app";
import { request } from "@core/libs/api/config";
import { ApiResponse } from "@core/libs/api/types";
import { RackModel } from "@core/model/rack";
import {
  OkResponse,
  PromoVerifyResponse,
  TransactionLookupModel,
  TransactionModel,
} from "@core/model/transaction";
import { PromoModel, PromoCheckResponse } from "@core/model/promo";

// Racks
export const racksService = {
  list: request.get<ApiResponse<RackModel[]>>(API_ENDPOINT.pos.racks),
  create: request.post<
    ApiResponse<RackModel>,
    { code: string; name?: string; location?: string }
  >(API_ENDPOINT.pos.racks),
  update: (id: string) =>
    request.put<
      ApiResponse<RackModel>,
      { code?: string; name?: string; location?: string }
    >(`${API_ENDPOINT.pos.racks}/${id}`),
  remove: (id: string) =>
    request.delete<ApiResponse<OkResponse>>(`${API_ENDPOINT.pos.racks}/${id}`),
};

// Transactions
export const transactionsService = {
  list: request.get<ApiResponse<TransactionModel[]>>(
    API_ENDPOINT.pos.transactions
  ),
  listMine: request.get<ApiResponse<TransactionModel[]>>(
    API_ENDPOINT.pos.transactionsMy
  ),
  create: request.post<ApiResponse<TransactionModel>, FormData>(
    API_ENDPOINT.pos.transactions
  ),
  scan: request.post<ApiResponse<OkResponse>, { qr: string }>(
    API_ENDPOINT.pos.transactionsScan
  ),
  lookup: request.get<ApiResponse<TransactionLookupModel>>(
    API_ENDPOINT.pos.transactionsLookup
  ),
  getById: request.get<ApiResponse<TransactionLookupModel>>(
    API_ENDPOINT.pos.transactions
  ),
  verifyPromo: request.post<ApiResponse<PromoVerifyResponse>>(
    `${API_ENDPOINT.pos.transactions}/promo/verify`
  ),
  markReadyToPickup: request.post<ApiResponse<OkResponse>, { id: string }>(
    `${API_ENDPOINT.pos.transactions}/ready-to-pickup`
  ),
  markCompleted: request.post<ApiResponse<OkResponse>, { id: string }>(
    `${API_ENDPOINT.pos.transactions}/complete`
  ),
};

// Promos
export const promosService = {
  list: request.get<ApiResponse<PromoModel[]>>(API_ENDPOINT.pos.promos),
  check: request.get<ApiResponse<PromoCheckResponse>>(
    `${API_ENDPOINT.pos.promos}/check`
  ),
};
