import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";
import { fetchClient } from "@/app/_lib/fetchClient";

export const getSingleKatsuInfo: QueryFunction<
  IKatsuInfo,
  [_1: string, _2: string]
> = async ({ queryKey }) => {
  const [_1, postId] = queryKey;
  
  return fetchClient<IKatsuInfo>(`/api/store/${postId}/detail`, {
    next: {
      tags: ["store", postId],
      revalidate: 60,
    },
  });
};
