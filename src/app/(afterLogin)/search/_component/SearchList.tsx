"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import { useQuery } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuInfo from "@/app/(afterLogin)/_component/KatsuInfo";
import { getSearchList } from "../_lib/getSearchList";
import { useSession } from "next-auth/react";
import NonSearch from "./NonSearch";
import FilterComponent from "../../_component/FilterBar";

type Props = {
  searchParams: { query: string; order: string };
};

export default function SearchList({ searchParams }: Props) {
  const session = useSession();
  const user_email = session.data?.user?.email as string;
  const { data } = useQuery<
    IKatsuInfo[],
    Object,
    IKatsuInfo[],
    [_1: string, _2: string, user_email: string, Props["searchParams"]]
  >({
    queryKey: ["store", "search", user_email, searchParams],
    queryFn: getSearchList,
  });

  return (
    <>
      {data?.length === 0 ? (
        <NonSearch />
      ) : (
        <div>
          <FilterComponent />
          <main className={styles.listContainer}>
            {data?.map((item: IKatsuInfo, idx: any) => {
              return <KatsuInfo info={item} key={item.post_id} />;
            })}
          </main>
        </div>
      )}
    </>
  );
}
