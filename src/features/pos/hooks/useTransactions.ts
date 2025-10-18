import { useMutation, useQuery } from "@tanstack/react-query";
import { transactionsService } from "@core/services/pos";
import { PromoVerifyRequest, TransactionCreateRequest } from "@core/model/transaction";
import { QueryParams } from "../../../core/libs/api/types";
import { BaseValue } from "../../_global/components/SmartFilter";
import { useQueryParamsFilter } from "../../_global/hooks/useQueryParamsFilter";
import useDebounce from "../../_global/hooks/useDebounce";

interface TransactionQueryParams extends QueryParams {
  minPrice?: BaseValue;
  maxPrice?: BaseValue;
  status?: BaseValue;
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
  return useMutation({
    mutationKey: ["transaction-create"],
    mutationFn: (body: TransactionCreateRequest) =>
      transactionsService.create(body),
  });
};

export const usePromoVerify = () => {
  return useMutation({
    mutationKey: ["promo-verify"],
    mutationFn: (body: PromoVerifyRequest) => transactionsService.verifyPromo(body),
  });
};
