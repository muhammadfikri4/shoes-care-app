import { useQuery, useMutation } from "@tanstack/react-query";
import { promosService } from "@core/services/pos";
import { ApiResponse } from "@core/libs/api/types";
import { toast } from "react-toastify";

import { useSearchParams } from "react-router-dom";

export const usePromosList = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");

  return useQuery({
    queryKey: ["promos", { page, perPage }],
    queryFn: () =>
      promosService.list({
        queryParams: {
          ...(page && { page }),
          ...(perPage && { perPage }),
        },
      }),
  });
};

export const usePromoCheck = () => {
  return useMutation({
    mutationKey: ["promo-check"],
    mutationFn: (code: string) => promosService.check({ path: code }),
    onError: (err: ApiResponse) => toast.error(err?.message || "Kode promo tidak valid"),
    onSuccess: (res) => toast.success(res?.message || "Kode promo valid"),
  });
};

export const usePromosSummary = () => {
  return useQuery({
    queryKey: ["promos-summary"],
    queryFn: () => promosService.summarize(),
  });
};

