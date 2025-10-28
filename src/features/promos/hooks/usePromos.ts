import { useQuery, useMutation } from "@tanstack/react-query";
import { promosService } from "@core/services/pos";
import { ApiResponse } from "@core/libs/api/types";
import { toast } from "react-toastify";

export const usePromosList = () => {
  return useQuery({
    queryKey: ["promos"],
    queryFn: () => promosService.list(),
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

