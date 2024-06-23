"use client";

import styles from "@/app/(afterLogin)/_component/katsuInfo.module.css";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuArticle from "./KatsuArticle";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MouseEventHandler } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  info: IKatsuInfo;
};

export default function KatsuInfo({ info }: Props) {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  let target = info;

  const scrapId = uuidv4();
  const user_email = session.data?.user?.email;
  const postId = info.post_id;
  const scrap = useMutation({
    mutationFn: async () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/${postId}/scrap`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ scrapId, user_email, postId }),
        }
      );
    },
    onMutate() {
      //실시간 변화
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "store") {
          const value: IKatsuInfo | IKatsuInfo[] | undefined =
            queryClient.getQueryData(queryKey);
          if (Array.isArray(value)) {
            const index = value.findIndex((v) => v.post_id === postId);
            //인덱스가 있다면
            if (index > -1) {
              const shallow = [...value];
              shallow[index] = {
                ...shallow[index],
                is_scrap: 1,
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            //상세보기인 경우
            if (value.post_id === postId) {
              const shallow = {
                ...value,
                is_scrap: 1,
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onError() {
      alert("오류가 발생했습니다!");
    },
    onSettled() {},
  });

  const unscrap = useMutation({
    mutationFn: async (unScrapId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/${postId}/scrap`,
        {
          method: "delete",
          credentials: "include",
          body: JSON.stringify({ unScrapId }),
        }
      );
    },
    onMutate(unScrapId: string) {
      //실시간 변화
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "store") {
          const value: IKatsuInfo | IKatsuInfo[] | undefined =
            queryClient.getQueryData(queryKey);
          if (Array.isArray(value)) {
            const index = value.findIndex((v) => v.post_id === postId);
            //인덱스가 있다면
            if (index > -1) {
              const shallow = [...value];
              shallow[index] = {
                ...shallow[index],
                is_scrap: 0,
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            //상세보기인 경우
            if (value.post_id === postId) {
              const shallow = {
                ...value,
                is_scrap: 0,
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onError() {
      alert("오류가 발생했습니다!");
    },
    onSettled() {},
  });

  const onClickScrap: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (session.data === null) {
      router.push("/loginform");
    } else {
      if (info.is_scrap === 1) {
        unscrap.mutate(info.scrap_id);
      } else {
        scrap.mutate();
      }
    }
  };
  return (
    <KatsuArticle post={target}>
      <div style={{ position: "relative" }}>
        <img src={info.image_url} className={styles.storeImage} />
        <div className={styles.storeBookMark} onClick={onClickScrap}>
          {info.is_scrap === 1 ? <BsBookmarkFill /> : <BsBookmark />}
        </div>
      </div>

      <div className={styles.storeTitle}>{info.title}</div>

      <div className={styles.storeName}>{info.name}</div>
      <div className={styles.storeLocation}>{info.address}</div>
    </KatsuArticle>
  );
}
