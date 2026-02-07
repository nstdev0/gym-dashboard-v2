import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
};

export const makeQueryClient = () => {
    return new QueryClient(queryClientConfig);
};
