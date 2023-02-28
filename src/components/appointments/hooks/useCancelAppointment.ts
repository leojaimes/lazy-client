import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyOperation } from 'fast-json-patch';
import { Appointment } from '../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): (appointment: Appointment) => void {
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationKey: [queryKeys.appointments],
    mutationFn: (appointment: Appointment) =>
      removeAppointmentUser(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({
        title: 'Remove succeded',
        status: 'warning',
      });
    },
  });

  return mutate;
  // TODO: replace with mutate function
}
