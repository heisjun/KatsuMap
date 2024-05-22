"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import KatsuInfo from "./KatsuInfo";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";

export default function KatsuList() {
  const { data } = useQuery({
    queryKey: ["store", "info"],
    queryFn: getStoreInfo,
  });

  return (
    <main className={styles.mainWrapper}>
      {data.map((item: IKatsuInfo, idx: any) => {
        return <KatsuInfo info={item} key={item.name} />;
      })}
    </main>
  );
}
