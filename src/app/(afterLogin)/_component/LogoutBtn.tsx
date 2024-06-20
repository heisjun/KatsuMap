"use client";

import style from "./logoutBtn.module.css";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "@auth/core/types";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  me: Session | null;
};
export default function LogoutBtn({ me }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onLogout = () => {
    queryClient.invalidateQueries({
      queryKey: ["store"],
    });
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
    signOut({ redirect: false }).then(() => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
        method: "post",
        credentials: "include",
      });

      router.replace("/");
      router.refresh();
    });
  };

  if (!me?.user) {
    return null;
  }

  return (
    <button className={style.logOutButton} onClick={onLogout}>
      <div className={style.logOutUserImage}>
        <img
          src={me.user?.image ? me.user?.image : `/Logo.png`}
          alt={me.user?.email as string}
        />
      </div>
      <div className={style.logOutUserName}>
        <div>{me.user?.name}</div>
        <div>@{me.user?.name}</div>
      </div>
    </button>
  );
}
