"use client";

import { ReactNode } from "react";
import styles from "@/app/(afterLogin)/_component/katsuInfo.module.css";
import Link from "next/link";
import { IKatsuInfo } from "@/model/KatsuInfo";

type Props = {
  children: ReactNode;
  post: IKatsuInfo;
};

export default function KatsuArticle({ children, post }: Props) {
  return (
    <Link
      href={`/${post.post_id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        width: "100%",
      }}
    >
      <article className={styles.infoWrapper}>{children}</article>
    </Link>
  );
}
