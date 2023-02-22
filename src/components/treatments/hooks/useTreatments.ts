import { useQuery } from "@tanstack/react-query";

import type { Treatment } from "../../../../../shared/types";
import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";
import { useCustomToast } from "../../app/hooks/useCustomToast";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const fallback = [];
  const { data = fallback } = await axiosInstance.get("/treatments");

  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  const toast = useCustomToast();
  const { data } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: () => getTreatments(),
    onError: (error) => {
      const title =
        error instanceof Error
          ? error.message
          : "Error connection to the server";
      toast({
        title,
        status: "error",
      });
    },
  });
  return data;
}
