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
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IUser } from "@/model/User";
import cx from "classnames";

interface Props {
  session: Session | null;
  profile: IUser | null;
}
export default function NavMenu({ session, profile }: Props) {
  const segment = useSelectedLayoutSegment();
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSide = () => {
    setIsOpen(true);
  };
  const router = useRouter();

  const handleCircleClick = () => {
    setIsExpanded(true);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div
          ref={containerRef}
          className={style.searchBox}
          onClick={handleCircleClick}
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cx(style.inputSearch, isExpanded ? style.expanded : "")}
            placeholder="어떤 돈가스를 찾으시나요"
            onKeyDown={(e) => activeEnter(e)}
          />
          <button onClick={handleSearch} className={style.btnSearch}>
            <IoSearchOutline className={style.searchIcon} />
          </button>
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
          profile={profile}
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
              <MypageDropdown profile={profile} />
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
