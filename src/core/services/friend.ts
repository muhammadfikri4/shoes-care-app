import { API_ENDPOINT } from "../configs/app";
import { request } from "../libs/api/config";
import { ApiResponse } from "../libs/api/types";
import { AddFriendDTO, FriendDTO } from "../model/friend";

export const friendService = {
  add: request.post<ApiResponse, AddFriendDTO>(API_ENDPOINT.friend.add),
  get: request.get<ApiResponse<FriendDTO[]>>(API_ENDPOINT.friend.base),
};
