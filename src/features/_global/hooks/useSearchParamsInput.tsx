import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { convertQueryParamsToObject } from "../helper";
import { omitObject } from "../utils/omit-object";

export const useSearchParamsInput = (paramKey: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = convertQueryParamsToObject(searchParams.toString());
  const value = searchParams.get(paramKey) || "";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams({
        [paramKey]: e.target.value,
      });
    },
    [setSearchParams, paramKey]
  );

  useEffect(() => {
    if (!value) {
      const omit = omitObject(queries, paramKey);
      setSearchParams(omit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return {
    value,
    handleInputChange,
    fn: (func: (val: string) => void) => func(value), 
    setSearchParams,
    queries
  };
};
