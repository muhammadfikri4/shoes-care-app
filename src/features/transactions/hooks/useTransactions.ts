import { useMutation, useQuery } from "@tanstack/react-query";
import { transactionsService } from "@core/services/pos";
import { PromoVerifyRequest } from "@core/model/transaction";
import { QueryParams } from "../../../core/libs/api/types";
import { BaseValue } from "../../_global/components/SmartFilter";
import { useQueryParamsFilter } from "../../_global/hooks/useQueryParamsFilter";
import useDebounce from "../../_global/hooks/useDebounce";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

interface TransactionQueryParams extends QueryParams {
  minPrice?: BaseValue;
  maxPrice?: BaseValue;
  status?: BaseValue;
  code?: string;
  qr?: string;
}

export const useTransactionsList = () => {
  const filter = useQueryParamsFilter<TransactionQueryParams>();
  const search = useDebounce(filter?.search, 500);
  return useQuery({
    queryKey: [
      "transactions",
      {
        search,
        minPrice: filter?.minPrice,
        maxPrice: filter?.maxPrice,
        status: filter?.status,
      },
    ],
    queryFn: () =>
      transactionsService.list({
        queryParams: {
          ...(filter?.minPrice && { minPrice: filter.minPrice?.value }),
          ...(filter?.maxPrice && { maxPrice: filter.maxPrice?.value }),
          ...(filter?.status && { status: filter.status?.value }),
          ...(search && { search }),
        },
      }),
  });
};

export const useTransactionCreate = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["transaction-create"],
    mutationFn: (body: FormData) =>
      transactionsService.create(body, {
        contentType: "form-data",
      }),
    onError: (err) => toast.error(err.message),
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/admin/transactions");
      if (res?.data?.midtransRedirectUrl) {
        window.open(res?.data?.midtransRedirectUrl, "_blank");
        return;
      }
    },
  });
};

export const usePromoVerify = () => {
  return useMutation({
    mutationKey: ["promo-verify"],
    mutationFn: (body: PromoVerifyRequest) =>
      transactionsService.verifyPromo(body),
    onError: (err) => toast.error(err.message),
    onSuccess: (res) => toast.success(res.message),
  });
};

export const useLookupTransaction = () => {
  return useMutation({
    mutationFn: (data: Required<Pick<TransactionQueryParams, "code" | "qr">>) =>
      transactionsService.lookup({
        queryParams: {
          ...(data?.code && {
            code: data.code,
          }),
          ...(data?.qr && {
            qr: data.qr,
          }),
        },
      }),
  });
};

export const useDetailTransaction = () => {
  const { transactionId } = useParams();
  return useQuery({
    queryKey: ["transaction-detail", { transactionId }],
    queryFn: () =>
      transactionsService.getById({
        path: transactionId,
      }),
    enabled: !!transactionId,
  });
};
