import { ReactNode } from "react";
import style from "@/app/(afterLogin)/layout.module.css";
import RQProvider from "./_component/RQProvider";

type Props = { children: ReactNode; modal: ReactNode };
export default async function AfterLoginLayout({ children, modal }: Props) {
  return (
    <div className={style.container}>
      <RQProvider>
        <header className={style.headerWrapper}>
          <section className={style.leftSection}>
            <div>로고</div>
          </section>
          <section className={style.rigntSection}>
            <div>돈카츠맵 소개</div>
            <div>로그인</div>
            <div>마이페이지</div>
            <div>언어선택</div>
          </section>
        </header>
        <main className={style.main}>{children}</main>
      </RQProvider>
    </div>
  );
}
