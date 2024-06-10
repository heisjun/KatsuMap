import { ReactNode } from "react";
import style from "@/app/(afterLogin)/layout.module.css";
import RQProvider from "./_component/RQProvider";
import NavMenu from "./_component/NavMenu";

type Props = { children: ReactNode };
export default function AfterLoginLayout({ children }: Props) {
  return (
    <div className={style.container}>
      <RQProvider>
        <NavMenu />
        <main className={style.main}>{children}</main>
      </RQProvider>
    </div>
  );
}
