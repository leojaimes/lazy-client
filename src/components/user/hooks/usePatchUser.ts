import jsonpatch from 'fast-json-patch';

import {
  useMutation,
  UseMutateFunction,
  useQueryClient,
} from '@tanstack/react-query';
import type { User } from '../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { queryKeys } from '../../../react-query/constants';
// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    }
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<
  User | null,
  unknown,
  User | null,
  unknown
> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate: patchUser } = useMutation({
    mutationFn: (newData: User | null) => patchUserOnServer(newData, user),
    // onMutate returns context that is passed to onError
    onMutate: async (newData: User | null) => {
      // cancel any outgoing queries for user data, so old server data
      // doesn't overwrite  our optimistic update
      queryClient.cancelQueries({ queryKey: [queryKeys.user] });

      // Take a snapshot of previus user value
      const previousUserData: User = queryClient.getQueriesData({
        queryKey: [queryKeys.user],
      });
      if (newData) updateUser(newData);
      // optimistically update the catche with new value
      // return context object with snapshotted value

      return { previousUserData };
    },
    onError(error, newData, context) {
      // if there is an error we are going to roll back. roll back cache to save value
      if (context?.previousUserData) {
        updateUser(context?.previousUserData);
        toast({ title: 'User failed!', status: 'warning' });
      }
    },
    onSuccess: (userData: User | null) => {
      if (!userData) return;
      // updateUser(userData);
      toast({ title: 'User uploaded!', status: 'success' });
    },
    // onSettled happends when there is an error or success
    onSettled: () => {
      // invalidate query user to  make sure we are in sync with server data
      queryClient.invalidateQueries({ queryKey: [queryKeys.user] }); // return data to previous state
    },
  });
  // const patchUser = (newData: User | null) => {
  //   // nothing to see here
  // };

  return patchUser;
}
