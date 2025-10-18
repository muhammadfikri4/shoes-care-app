import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retryDelay: 3000,
    },
    mutations: {
      retry: 0,
      retryDelay: 3000,
    },
  },
});
