import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/query-core";
import { fetchClient } from "@/app/_lib/fetchClient";

export const getStoreInfo: QueryFunction<
  IKatsuInfo[],
  [_1: string, _2: string, user_email: string, searchParams: { order: string }],
  number
> = async ({ queryKey, pageParam }) => {
  const [_1, _2, user_email, searchParams] = queryKey;
  const urlSearchParams = new URLSearchParams(searchParams);

  return fetchClient<IKatsuInfo[]>(
    `/api/store/list?user_email=${user_email || ""}&${urlSearchParams.toString()}&cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "search", user_email, searchParams.order].filter(
          (tag): tag is string => typeof tag === "string",
        ),
        revalidate: 60,
      },
      credentials: "include",
    }
  );
};
