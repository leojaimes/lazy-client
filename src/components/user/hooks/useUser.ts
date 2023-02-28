import { AxiosResponse } from 'axios';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import type { User } from '../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

// query function
async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    }
  );

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: [queryKeys.user],
    // queryFn: () => getUser(user),
    // populate initially with user in localStorage
    initialData: getStoredUser,
  });

  React.useEffect(() => {
    if (user) {
      setStoredUser(user);
    } else {
      clearStoredUser();
    }
  }, [user]);
  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update the user in the query cache
    queryClient.setQueriesData([queryKeys.user], newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.setQueryData([queryKeys.user], null);
  }

  return { user, updateUser, clearUser };
}
