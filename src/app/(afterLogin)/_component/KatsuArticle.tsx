"use client";

import { ReactNode } from "react";
import styles from "@/app/(afterLogin)/_component/katsuInfo.module.css";
import { useRouter } from "next/navigation";
import { IKatsuInfo } from "@/model/KatsuInfo";

type Props = {
  children: ReactNode;
  post: IKatsuInfo;
};

export default function KatsuArticle({ children, post }: Props) {
  const router = useRouter();
  let target = post;

  const onClick = () => {
    router.push(`/${target.post_id}`);
  };

  return (
    <article onClick={onClick} className={styles.infoWrapper}>
      {children}
    </article>
  );
}
