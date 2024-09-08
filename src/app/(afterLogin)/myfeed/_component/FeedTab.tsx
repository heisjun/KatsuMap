"use client";

import style from "./feedTab.module.css";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function FeedTab() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className={style.container}>
      <div className={style.mypageHeader}>
        <span className={style.title}> 마이페이지</span>
      </div>

      <div className={style.navMenu}>
        {segment === "bookmark" ? (
          <Link href={"/myfeed/bookmark"} className={style.onLink}>
            <span>북마크</span>
          </Link>
        ) : (
          <Link href={"/myfeed/bookmark"} className={style.link}>
            <span>북마크</span>
          </Link>
        )}

        <Link href={"/myfeed"} className={style.link}>
          <span>작성한 글</span>
        </Link>
        {segment === null ? (
          <Link href={"/myfeed"} className={style.onLink}>
            <span>회원정보수정</span>
          </Link>
        ) : (
          <Link href={"/myfeed"} className={style.link}>
            <span>회원정보수정</span>
          </Link>
        )}
      </div>
    </div>
  );
}
