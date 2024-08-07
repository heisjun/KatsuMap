"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import style from "@/app/(afterLogin)/layout.module.css";
import Link from "next/link";
import { Session } from "next-auth";
import MypageDropdown from "./MyPageDropDown";
import { User } from "@/app/_lib/definitions";

interface Props {
  session: Session | null;
}
export default function NavMenu({ session }: Props) {
  const segment = useSelectedLayoutSegment();
  return (
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
              <span style={{ fontWeight: "bold" }}>돈카츠맵</span>
            </Link>
          </>
        ) : (
          <>
            <Link href={"/map"}>
              <span>돈카츠맵</span>
            </Link>
          </>
        )}

        {session ? (
          segment === "myfeed" ? (
            <>
              <Link href={`/myfeed/${session?.user?.email}`}>
                <span style={{ fontWeight: "bold" }}>북마크</span>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/myfeed/${session?.user?.email}`}>
                <span>북마크</span>
              </Link>
            </>
          )
        ) : null}
        {/* {segment === "content" ? (
            <>
              <Link href={"/content/post"}>
                <span style={{ fontWeight: "bold" }}>글쓰기</span>
              </Link>
            </>
          ) : (
            <>
              <Link href={"/content/post"}>
                <span>글쓰기</span>
              </Link>
            </>
          )} */}
        {session ? (
          <>
            <MypageDropdown user={session.user as User} />
          </>
        ) : (
          <>
            <Link href="/loginform">
              <span>로그인</span>
            </Link>
          </>
        )}
      </section>
    </header>
  );
}
