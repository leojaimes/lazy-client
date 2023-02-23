import { useQuery } from '@tanstack/react-query';

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
