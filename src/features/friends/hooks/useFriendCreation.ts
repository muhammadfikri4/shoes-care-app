import { useMutation } from "@tanstack/react-query";
import { AddFriendDTO } from "../../../core/model/friend";
import { friendService } from "../../../core/services/friend";
import { toast } from "react-toastify";

export const useAddFriend = () => {
  return useMutation({
    mutationFn: async (data: AddFriendDTO) => friendService.add(data),
    onSuccess: (res) => toast.success(res.message),
    onError: (error) => toast.error(error.message),
  });
};
