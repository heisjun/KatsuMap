import { ReactNode } from "react";
import style from "@/app/(afterLogin)/layout.module.css";
import RQProvider from "./_component/RQProvider";
import NavMenu from "./_component/NavMenu";
import { auth } from "@/auth";

type Props = { children: ReactNode; modal: ReactNode };
export default async function AfterLoginLayout({ children, modal }: Props) {
  const session = await auth();
  return (
    <div className={style.container}>
      <RQProvider>
        {modal}
        <NavMenu session={session} />
        <main className={style.main}>{children}</main>
      </RQProvider>
    </div>
  );
}
