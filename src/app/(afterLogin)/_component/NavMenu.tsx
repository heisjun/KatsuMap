"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import style from "@/app/(afterLogin)/layout.module.css";
import Link from "next/link";
import { Session } from "next-auth";
import MypageDropdown from "./MyPageDropDown";
import { User } from "@/app/_lib/definitions";
import { IoSearchOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import SideBar from "./SideBar";
interface Props {
  session: Session | null;
}
export default function NavMenu({ session }: Props) {
  const segment = useSelectedLayoutSegment();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSide = () => {
    setIsOpen(true);
  };
  const router = useRouter();

  const handleButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isFocused && searchValue) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    } else {
      setIsFocused(true);
    }
  };

  const activeEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  // 사이드바 외부를 클릭했을 때 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <header className={style.headerWrapper}>
      <section className={style.leftSection}>
        <Link href={"/"}>
          <img src="/Logo.png" alt="로고" />
        </Link>
      </section>
      <section className={style.rigntSection}>
        <div className={style.searchBox}>
          <button
            className={style.btnSearch}
            onClick={handleButtonClick}
            onTouchStart={handleButtonClick}
          >
            <IoSearchOutline className={style.searchIcon} />
          </button>
          <input
            type="text"
            className={style.inputSearch}
            placeholder="어떤 돈가스를 찾으시나요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => activeEnter(e)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        <div style={{ paddingLeft: 20 }} className={style.burgur}>
          <RxHamburgerMenu
            style={{ fontSize: 30, color: "black" }}
            onClick={toggleSide}
          />
        </div>
        <SideBar
          isOpen={isOpen}
          user={session?.user as User | null}
          setIsOpen={setIsOpen}
        />
        {isOpen && (
          <div className={style.overlay} onClick={handleCloseSidebar}></div>
        )}
        <div className={style.invisibleContent}>
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
            <>
              {segment === "content" ? (
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
              )}
            </>
          ) : (
            <></>
          )}

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
        </div>
      </section>
    </header>
  );
}
