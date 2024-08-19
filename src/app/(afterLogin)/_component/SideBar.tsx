import { RxCross1 } from "react-icons/rx";
import styles from "./sideBar.module.css";
import Link from "next/link";
import cx from "classnames";
import { User } from "@/app/_lib/definitions";
import { usePathname } from "next/navigation";

interface ISideBar {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
  user: User;
}
export default function SideBar(props: ISideBar) {
  const { isOpen, setIsOpen, user } = props;
  const pathname = usePathname();
  const toggleSide = () => {
    setIsOpen(false);
  };

  return (
    <div className={cx(styles.sideBarWarp, isOpen && styles.open)}>
      <div className={styles.sideHeader}>
        <div className={styles.profileBlock}>
          <img
            className={styles.profile}
            src={user.image ? user.image : "/avatar.png"}
          />
          <div>{user.name}</div>
        </div>

        <RxCross1
          onClick={toggleSide}
          onKeyDown={toggleSide}
          style={{ fontSize: 20, color: "black" }}
        />
      </div>
      <ul className={styles.ulMenu}>
        {pathname === "/map" ? (
          <Link href={"/map"} onClick={toggleSide}>
            <li className={styles.strongLi}>돈카츠맵</li>
          </Link>
        ) : (
          <Link href={"/map"} onClick={toggleSide}>
            <li>돈카츠맵</li>
          </Link>
        )}
        {pathname === "/content/post" ? (
          <Link href={"/content/post"} onClick={toggleSide}>
            <li className={styles.strongLi}>글쓰기</li>
          </Link>
        ) : (
          <Link href={"/content/post"} onClick={toggleSide}>
            <li>글쓰기</li>
          </Link>
        )}
        {pathname.startsWith("/myfeed") ? (
          <Link href={"/myfeed"} onClick={toggleSide}>
            <li className={styles.strongLi}>마이페이지</li>
          </Link>
        ) : (
          <Link href={"/myfeed"} onClick={toggleSide}>
            <li>마이페이지</li>
          </Link>
        )}

        <li>로그아웃</li>
      </ul>
    </div>
  );
}
