"use client";

import styles from "@/app/(afterLogin)/_component/main.module.css";
import KatsuInfo from "./KatsuInfo";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { useSession } from "next-auth/react";
import FilterComponent from "./FilterBar";
import BannerSwiper from "./BannerSwiper";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  searchParams: { order: string };
};

export default function KatsuList({ searchParams }: Props) {
  const session = useSession();
  const user_email = session.data?.user?.email as string;
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      IKatsuInfo[],
      Object,
      InfiniteData<IKatsuInfo[]>, //인피니트 스크롤용 타입
      [_1: string, _2: string, user_email: string, Props["searchParams"]],
      number
    >({
      queryKey: ["store", "info", user_email, searchParams],
      queryFn: getStoreInfo,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return allPages.length;
      },
      staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
      gcTime: 300 * 1000,
    });

  const { ref, inView } = useInView({
    threshold: 1,
    delay: 10,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.bannerContainer}>
        <BannerSwiper
          infos={[
            {
              banner: "/dbtiBanner5.webp",
              goto: `${process.env.NEXT_PUBLIC_BASE_URL}/donbti`,
            },
            {
              banner: "/katsumapBanner.jpg",
              goto: `${process.env.NEXT_PUBLIC_BASE_URL}/map`,
            },
          ]}
        />
      </div>
      <FilterComponent />
      <main className={styles.listContainer}>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((info) => (
              <KatsuInfo key={info.post_id} info={info} />
            ))}
          </Fragment>
        ))}
        <div ref={ref} style={{ height: 50 }} />
      </main>
    </div>
  );
}
