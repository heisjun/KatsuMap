"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import KatsuInfo from "./KatsuInfo";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { useSession } from "next-auth/react";
import FilterComponent from "./FilterBar";

type Props = {
  searchParams: { order: string };
};

export default function KatsuList({ searchParams }: Props) {
  const session = useSession();
  const user_email = session.data?.user?.email as string;
  const { data } = useQuery<
    IKatsuInfo[],
    Object,
    IKatsuInfo[],
    [_1: string, _2: string, user_email: string, Props["searchParams"]]
  >({
    queryKey: ["store", "info", user_email, searchParams],
    queryFn: getStoreInfo,
  });

  return (
    <div className={styles.mainWrapper}>
      <FilterComponent />
      <main className={styles.listContainer}>
        {data?.map((item: IKatsuInfo, idx: any) => {
          return <KatsuInfo info={item} key={item.post_id} />;
        })}
      </main>
    </div>
  );
}
