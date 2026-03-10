import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";
import { fetchClient } from "@/app/_lib/fetchClient";

export const getScrapList: QueryFunction<
  IKatsuInfo[],
  [_1: string, _2: string, _3: string]
> = async ({ queryKey }) => {
  const [_1, _2, userId] = queryKey;
  return fetchClient<IKatsuInfo[]>(`/api/mypage/${userId}/scraps`, {
    next: {
      tags: ["mypage", "scrap", userId],
    },
    cache: "no-store",
  });
};
