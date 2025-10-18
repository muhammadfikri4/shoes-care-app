import { useSearchParams } from "react-router-dom";
import { QueryParams } from "../../../core/libs/api/types";

export const useQueryParamsFilter = <T = QueryParams>() => {
  const [searchParams] = useSearchParams();
  const getQueryParam = (name: string) => searchParams.get(name);
  const filter = JSON.parse(getQueryParam("filter") || "{}");
  return filter as T;
};
