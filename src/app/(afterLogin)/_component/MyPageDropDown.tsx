"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./mypageDropDown.module.css";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

interface Props {
  user: string;
}
export default function MypageDropdown({ user }: Props) {
  interface Iprofile {
    accountId: number;
    nickName: string;
    address: string;
    homePage: null;
    selfInfo: null;
    profileUrl: string;
  }

  const [profile, setProfile] = useState<Iprofile>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const onLogout = () => {
    queryClient.removeQueries({
      queryKey: ["store", "info", user],
    });
    queryClient.removeQueries({
      queryKey: ["mypage"],
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

  const option = [
    {
      id: 1,
      list: [
        { name: "마이페이지", url: "/myfeed" },
        { name: "로그아웃", url: "" },
      ],
    },
  ];
  const [isActive, setIsActive] = useState([false]);
  const dropdownListRef = useRef<any>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        dropdownListRef.current &&
        !dropdownListRef.current.contains(e.target as Node)
      ) {
        setIsActive([false]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownListRef]);

  function onOpenBtn(index: number) {
    const newIsActive = [...isActive];
    newIsActive[index] = true;
    setIsActive(newIsActive);
  }

  return (
    <div className={styles.filtersBlock}>
      {option.map((item: any, index: number) => {
        const { id, list } = item;
        return (
          <div className={styles.dropDown} key={id}>
            <img
              className={styles.dropDownBtn}
              onClick={() => onOpenBtn(index)}
              src={profile ? profile.profileUrl : "/Logo.png"}
            />
            {isActive[index] && (
              <div className={styles.dropDownContent} ref={dropdownListRef}>
                {list.map((option: any) => (
                  <div
                    className={styles.contentItem}
                    key={option.name}
                    onClick={() => {
                      option.url === "/myfeed"
                        ? router.push(`/myfeed/${user}`)
                        : onLogout();
                    }}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
