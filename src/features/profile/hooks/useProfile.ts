import { useQuery } from "@tanstack/react-query";
import { profileService } from "../../../core/services/profile";
import { CONFIG_APP } from "../../../core/configs/app";

export const useProfile = () => {
  const token = localStorage.getItem(CONFIG_APP.TOKEN_KEY);
  return useQuery({
    queryKey: ["profile", token],
    queryFn: () => profileService.get(),
  });
};
