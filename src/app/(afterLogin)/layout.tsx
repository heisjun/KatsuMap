import { ReactNode } from "react";
import style from "@/app/(afterLogin)/layout.module.css";
import RQProvider from "./_component/RQProvider";
import NavMenu from "./_component/NavMenu";
import { auth } from "@/auth";
import { IUser } from "@/model/User";
import { getUserServer } from "./myfeed/_lib/getUserServer";

type Props = { children: ReactNode; modal: ReactNode };
export default async function AfterLoginLayout({ children, modal }: Props) {
  const session = await auth();
  const profile: IUser | null = await getUserServer({
    queryKey: ["mypage", session?.user?.email as string],
  });
  return (
    <div className={style.container}>
      <RQProvider>
        {modal}
        <NavMenu session={session} profile={profile} />
        <main className={style.main}>{children}</main>
      </RQProvider>
    </div>
  );
}
