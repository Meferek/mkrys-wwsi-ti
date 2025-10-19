'use client';

import { createContext, useContext, ReactNode } from 'react';
import { SWRConfig } from 'swr';

export const TableRefreshContext = createContext<{
    refreshKey: number;
    triggerRefresh: () => void;
}>({
    refreshKey: 0,
    triggerRefresh: () => {},
});

export const useTableRefresh = () => useContext(TableRefreshContext);

interface TableDataProviderProps {
    children: ReactNode;
}

export function TableDataProvider({ children }: TableDataProviderProps) {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                revalidateOnMount: true,
                dedupingInterval: 500, // Zmniejszony dla szybszego odświeżania
            }}
        >
            {children}
        </SWRConfig>
    );
}
