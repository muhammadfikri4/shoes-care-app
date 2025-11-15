import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@core/services/pos";
import { PromoVerifyRequest } from "@core/model/transaction";
import { QueryParams } from "../../../core/libs/api/types";
import { BaseValue } from "../../_global/components/SmartFilter";
import { useQueryParamsFilter } from "../../_global/hooks/useQueryParamsFilter";
import useDebounce from "../../_global/hooks/useDebounce";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

interface TransactionQueryParams extends Omit<QueryParams, "search"> {
  status?: BaseValue;
  search?: BaseValue;
  startDate?: BaseValue;
  endDate?: BaseValue;
  code?: string;
  qr?: string;
}

export const useTransactionsList = () => {
  const filter = useQueryParamsFilter<TransactionQueryParams>();
  const search = useDebounce(filter?.search?.value, 500);
  return useQuery({
    queryKey: [
      "transactions",
      {
        search,
        status: filter?.status,
        startDate: filter?.startDate,
        endDate: filter?.endDate,
      },
    ],
    queryFn: () =>
      transactionsService.list({
        queryParams: {
          ...(filter?.status?.value && { status: filter.status?.value }),
          ...(filter?.startDate && { startDate: filter.startDate?.value }),
          ...(filter?.endDate && { endDate: filter.endDate?.value }),
          ...(search && { search }),
        },
      }),
    refetchOnMount: "always",
  });
};

export const useMyTransactionsList = () => {
  const filter = useQueryParamsFilter<TransactionQueryParams>();
  const search = useDebounce(filter?.search?.value, 500);
  return useQuery({
    queryKey: [
      "transactions-mine",
      {
        search,
        status: filter?.status,
        startDate: filter?.startDate,
        endDate: filter?.endDate,
      },
    ],
    queryFn: () =>
      transactionsService.listMine({
        queryParams: {
          ...(filter?.status?.value && { status: filter.status?.value }),
          ...(filter?.startDate && { startDate: filter.startDate?.value }),
          ...(filter?.endDate && { endDate: filter.endDate?.value }),
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

export const useMarkReadyToPickup = () => {
  const qc = useQueryClient();
  const { transactionId } = useParams();
  return useMutation({
    mutationKey: ["transaction-ready", { transactionId }],
    mutationFn: (payload: { id: string }) =>
      transactionsService.markReadyToPickup(payload),
    onSuccess: async (res) => {
      toast.success(res.message);
      await qc.invalidateQueries({
        queryKey: ["transaction-detail", { transactionId }],
      });
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useMarkCompleted = () => {
  const qc = useQueryClient();
  const { transactionId } = useParams();
  return useMutation({
    mutationKey: ["transaction-complete", { transactionId }],
    mutationFn: (payload: { id: string }) =>
      transactionsService.markCompleted(payload),
    onSuccess: async (res) => {
      toast.success(res.message);
      await qc.invalidateQueries({
        queryKey: ["transaction-detail", { transactionId }],
      });
    },
    onError: (err) => toast.error(err.message),
  });
};
