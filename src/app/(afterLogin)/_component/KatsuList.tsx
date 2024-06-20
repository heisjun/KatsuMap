"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import KatsuInfo from "./KatsuInfo";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { useSession } from "next-auth/react";

export default function KatsuList() {
  const session = useSession();
  const user_email = session.data?.user?.email as string;
  const { data } = useQuery<IKatsuInfo[], Object, IKatsuInfo[]>({
    queryKey: ["store", "info", user_email],
    queryFn: getStoreInfo,
  });

  return (
    <main className={styles.mainWrapper}>
      {data?.map((item: IKatsuInfo, idx: any) => {
        return <KatsuInfo info={item} key={item.post_id} />;
      })}
    </main>
  );
}
