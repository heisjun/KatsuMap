"use client";

import styles from "@/app/(afterLogin)/_component/katsuInfo.module.css";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuArticle from "./KatsuArticle";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useScrapMutation } from "../_hooks/useScrapMutation";
import { MouseEventHandler } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const { scrapMutation, unscrapMutation } = useScrapMutation({
    postId,
    user_email,
    scrapId,
  });

  const onClickScrap: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (session.data === null) {
      router.push("/loginform");
    } else {
      if (info.is_scrap === 1) {
        unscrapMutation.mutate(info.scrap_id);
      } else {
        scrapMutation.mutate();
      }
    }
  };
  return (
    <KatsuArticle post={target}>
      <div className={styles.imageBlock}>
        <Image
          src={info.image_url} // 이미지 경로
          className={styles.storeImage} // 기존 스타일 클래스
          alt="돈가스 이미지" // alt 텍스트
          width={350} // 이미지의 고정 너비 또는 원본 크기에 맞는 너비 값 (필수)
          height={350} // 이미지의 고정 높이 또는 원본 크기에 맞는 높이 값 (필수)
          priority
        />

        <div className={styles.storeBookMark} onClick={onClickScrap}>
          {info.is_scrap === 1 ? <BsBookmarkFill /> : <BsBookmark />}
        </div>
      </div>
      <div className={styles.storeTitle}>{info.name}</div>
      <div className={styles.storeName}>{info.title}</div>
      <div className={styles.storeLocation}>{info.address}</div>
    </KatsuArticle>
  );
}
