import { useMutation } from "@tanstack/react-query";
import { userService } from "../../../core/services/user";

interface OnlineDTO {
  status: "online" | "offline";
}

export const useOnlineChange = () => {
  return useMutation({
    mutationFn: ({ status }: OnlineDTO) =>
      userService.put(undefined, {
        path: status,
      }),
  });
};
