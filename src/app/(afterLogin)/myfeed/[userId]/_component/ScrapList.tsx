"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import { useQuery } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuInfo from "@/app/(afterLogin)/_component/KatsuInfo";
import { getScrapList } from "../_lib/getScrapList";

interface Props {
  userId: string;
}

export default function ScrapList({ userId }: Props) {
  const { data } = useQuery<
    IKatsuInfo[],
    Object,
    IKatsuInfo[],
    [_1: string, _2: string, _3: string]
  >({
    queryKey: ["mypage", "scrap", userId],
    queryFn: getScrapList,
  });

  return (
    <main className={styles.mainWrapper}>
      {data?.map((item: IKatsuInfo, idx: any) => {
        return <KatsuInfo info={item} key={item.post_id} />;
      })}
    </main>
  );
}
