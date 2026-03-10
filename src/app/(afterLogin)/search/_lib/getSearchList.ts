import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";
import { fetchClient } from "@/app/_lib/fetchClient";

export const getSearchList: QueryFunction<
  IKatsuInfo[],
  [
    _1: string,
    _2: string,
    user_email: string,
    searchParams: { query: string; order?: string }
  ]
> = async ({ queryKey }) => {
  const [_1, _2, user_email, searchParams] = queryKey;
  const urlSearchParams = new URLSearchParams(searchParams as any);
  return fetchClient<IKatsuInfo[]>(
    `/api/search?user_email=${user_email}&${urlSearchParams.toString()}`,
    {
      next: {
        tags: ["store", "search", user_email, searchParams.query],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
};
