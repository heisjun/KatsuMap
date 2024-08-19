import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";

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
  const urlSearchParams = new URLSearchParams(searchParams);
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/search?user_email=${user_email}&${urlSearchParams.toString()}`,
    {
      next: {
        tags: ["store", "search", user_email, searchParams.query],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
