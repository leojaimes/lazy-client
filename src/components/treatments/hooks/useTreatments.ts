import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { Treatment } from '../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const fallback: never[] = [];
  const { data = fallback } = await axiosInstance.get('/treatments');

  return data;
}

export function useTreatments(): Treatment[] | undefined {
  // TODO: get data from server via useQuery
  // const toast = useCustomToast();
  const { data } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: () => getTreatments(),
    // staleTime: 10 * 60 * 1000, // 10 min
    // cacheTime: 15 * 60 * 1000, // 15 min (doesn't make sense for staleTime to exceed cacheTime )
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // onError: (error) => {
    //   const title =
    //     error instanceof Error
    //       ? error.message
    //       : 'Error connection to the server';
    //   toast({
    //     title,
    //     status: 'error',
    //   });
    // },
    // Se remouve la funcion error: onError ya que está siendo enviada desde la constante queryClient de react-query > queryCliente
    // la variable queryClient está siendo importada en App.tsx de components > app > App.tsx
  });
  return data;
}
export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: () => getTreatments(),
    staleTime: 100000,
    cacheTime: 15 * 60 * 1000,
  });
}
