import { useQuery } from "@tanstack/react-query";
import { friendService } from "../../../core/services/friend";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../_global/hooks/useDebounce";

export const useFriend = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const searchQuery = useDebounce(search, 500);
  return useQuery({
    queryKey: ["friend", { searchQuery }],
    queryFn: () =>
      friendService.get({
        queryParams: {
          ...(searchQuery && { search: searchQuery }),
        },
      }),
      staleTime: 1000
  });
};
