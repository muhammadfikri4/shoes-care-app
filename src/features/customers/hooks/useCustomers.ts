import { useQuery } from "@tanstack/react-query";
import { userService } from "@core/services/user";
import { useSearchParams } from "react-router-dom";

export const useCustomers = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");

  return useQuery({
    queryKey: ["customers", { page, perPage }],
    queryFn: () =>
      userService.getCustomers({
        queryParams: {
          ...(page && { page }),
          ...(perPage && { perPage }),
        },
      }),
  });
};

export const useCustomersList = (
  search: string = "",
  perPage: string = "5"
) => {
  return useQuery({
    queryKey: ["customers-list", { search, perPage }],
    queryFn: () =>
      userService.getCustomers({
        queryParams: {
          search,
          perPage,
        },
      }),
  });
};
