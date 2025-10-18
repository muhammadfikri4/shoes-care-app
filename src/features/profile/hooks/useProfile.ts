import { useQuery } from "@tanstack/react-query";
import { profileService } from "../../../core/services/profile";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  });
};
