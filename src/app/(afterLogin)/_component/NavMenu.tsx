"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import style from "@/app/(afterLogin)/layout.module.css";
import Link from "next/link";

export default function NavMenu() {
  const segment = useSelectedLayoutSegment();
  return (
    <>
      <header className={style.headerWrapper}>
        <section className={style.leftSection}>
          <Link href={"/"}>
            <img src="/Logo.png" alt="로고" />
          </Link>
        </section>
        <section className={style.rigntSection}>
          {segment === "map" ? (
            <>
              <Link href={"/map"}>
                <div style={{ fontWeight: "bold" }}>돈카츠맵 소개</div>
              </Link>
            </>
          ) : (
            <>
              <Link href={"/map"}>
                <div>돈카츠맵 소개</div>
              </Link>
            </>
          )}

          <div>로그인</div>
          <div>마이페이지</div>
          {segment === "content" ? (
            <>
              <Link href={"/content/post"}>
                <div style={{ fontWeight: "bold" }}>글쓰기</div>
              </Link>
            </>
          ) : (
            <>
              <Link href={"/content/post"}>
                <div>글쓰기</div>
              </Link>
            </>
          )}
        </section>
      </header>
    </>
  );
}
