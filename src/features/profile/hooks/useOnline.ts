import { useMutation } from "@tanstack/react-query";
import { userService } from "../../../core/services/user";
import { toast } from "react-toastify";
import { ApiResponse } from "../../../core/libs/api/types";

interface OnlineDTO {
  status: "online" | "offline";
}

export const useOnlineChange = () => {
  return useMutation({
    mutationFn: ({ status }: OnlineDTO) =>
      userService.put(undefined, {
        path: status,
      }),
    onError: (err: ApiResponse) => toast.error(err?.message || "Gagal mengubah status"),
    onSuccess: (res: ApiResponse) => toast.success(res?.message || "Status berhasil diubah"),
  });
};
