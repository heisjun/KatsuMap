import { IKatsuInfo } from "@/model/KatsuInfo";
import { QueryFunction } from "@tanstack/react-query";

export const getSingleKatsuInfo: QueryFunction<
  IKatsuInfo,
  [_1: string, _2: string]
> = async ({ queryKey }) => {
  const [_1, id] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/detail/${id}`,
    {
      next: {
        tags: ["store", id],
      },
      cache: "no-store",
    }
  );
  if (!res) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
