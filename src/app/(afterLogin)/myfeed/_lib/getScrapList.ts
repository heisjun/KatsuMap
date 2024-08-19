import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";

export const getScrapList: QueryFunction<
  IKatsuInfo[],
  [_1: string, _2: string, _3: string]
> = async ({ queryKey }) => {
  const [_1, _2, userId] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/mypage/${userId}/scraps`,
    {
      next: {
        tags: ["mypage", "scrap", userId],
      },
      cache: "no-store",
    }
  );
  if (!res) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
