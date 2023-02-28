import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Appointment } from '../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update type for React Query mutate function
type AppointmentMutationFunction = (appointment: Appointment) => void;

export function useReserveAppointment(): AppointmentMutationFunction {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationKey: [queryKeys.appointments],
    mutationFn: (appointment: Appointment) => {
      return setAppointmentUser(appointment, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      console.log(
        'onSuccess invalidamos la query de apointments para que se ejecute nuevamente '
      );
      toast({
        title: 'you have reserved the appointment',
        status: 'success',
      });
    },
    onMutate: () => {
      console.log('mutated!!');
    },
    onError: () => {
      return Error();
    },
  });

  return mutate;
  // TODO: replace with mutate function
  // return (appointment: Appointment) => {
  //   // nothing to see here
  // };
}
