import styles from "./sideBar.module.css";
import Link from "next/link";
import cx from "classnames";
import { User } from "@/app/_lib/definitions";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { IUser } from "@/model/User";

interface ISideBar {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
  user: User | null;
  profile: IUser | null;
}
export default function SideBar(props: ISideBar) {
  const { isOpen, setIsOpen, user, profile } = props;
  const pathname = usePathname();
  const toggleSide = () => {
    setIsOpen(false);
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const onLogout = () => {
    setIsOpen(false);
    queryClient.removeQueries({
      queryKey: ["store", "info", user?.email],
    });
    queryClient.removeQueries({
      queryKey: ["mypage"],
    });
    signOut({ redirect: false }).then(() => {
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <div className={cx(styles.sideBarWarp, isOpen && styles.open)}>
      <div className={styles.sideHeader}>
        {user ? (
          <div className={styles.profileBlock}>
            <img
              className={styles.profile}
              src={profile?.image ? profile.image : "/avatar.png"}
            />
            <div>{profile?.nickname ? profile.nickname : profile?.name}</div>
          </div>
        ) : (
          <div className={styles.loginHeader}>
            <Link
              href="/loginform"
              onClick={toggleSide}
              className={styles.loginBtn}
            >
              <div>로그인</div>
            </Link>
            <pre className={styles.blank} />
            <Link
              href="/register"
              onClick={toggleSide}
              className={styles.registerBtn}
            >
              <div>회원가입</div>
            </Link>
          </div>
        )}
      </div>
      <ul className={styles.ulMenu}>
        <li className={pathname === "/map" ? styles.strongLi : ""}>
          <Link href={"/map"} onClick={toggleSide}>
            돈카츠맵
          </Link>
        </li>
        {user && (
          <>
            <li className={pathname === "/content/post" ? styles.strongLi : ""}>
              <Link href={"/content/post"} onClick={toggleSide}>
                글쓰기
              </Link>
            </li>
            <li
              className={pathname.startsWith("/myfeed") ? styles.strongLi : ""}
            >
              <Link href={"/myfeed"} onClick={toggleSide}>
                마이페이지
              </Link>
            </li>
            <li onClick={onLogout}>로그아웃</li>
          </>
        )}
      </ul>
    </div>
  );
}
