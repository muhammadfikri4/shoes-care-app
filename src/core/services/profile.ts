import { API_ENDPOINT } from "../configs/app";
import { request } from "../libs/api/config";
import { ApiResponse } from "../libs/api/types";
import { ProfileDTO } from "../model/profile";

export const profileService = {
  get: request.get<ApiResponse<ProfileDTO>>(API_ENDPOINT.user.profile),
};
