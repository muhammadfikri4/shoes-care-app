import { racksService } from "@core/services/pos";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const useRacksList = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");

  return useQuery({
    queryKey: ["racks", { page, perPage }],
    queryFn: () =>
      racksService.list({
        queryParams: {
          ...(page && { page }),
          ...(perPage && { perPage }),
        },
      }),
  });
};

export const useRackCreate = () =>
  useMutation({
    mutationKey: ["rack-create"],
    mutationFn: (body: { code: string; name?: string; description?: string }) =>
      racksService.create(body),
    onSuccess: (res) => toast.success(res?.message),
    onError: (err) => toast.error(err?.message),
  });

export const useRackUpdate = () =>
  useMutation({
    mutationKey: ["rack-update"],
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      code?: string;
      name?: string;
      description?: string;
    }) => racksService.update(id)(body),
    onSuccess: (res) => toast.success(res?.message),
    onError: (err) => toast.error(err?.message),
  });

export const useRackRemove = () =>
  useMutation({
    mutationKey: ["rack-remove"],
    mutationFn: (id: string) => racksService.remove({ path: id }),
    onSuccess: (res) => toast.success(res?.message),
    onError: (err) => toast.error(err?.message),
  });
