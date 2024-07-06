import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/query-core";

export const getStoreInfo: QueryFunction<
  IKatsuInfo[],
  [_1: string, _2: string, user_email: string, searchParams: { order: string }]
> = async ({ queryKey }) => {
  const [_1, _2, user_email, searchParams] = queryKey;
  const urlSearchParams = new URLSearchParams(searchParams);
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/store/list?user_email=${user_email}&${urlSearchParams.toString()}`,
    {
      next: {
        tags: ["posts", "search", user_email, searchParams.order],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
