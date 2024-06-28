"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./mypageDropDown.module.css";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { User } from "@/app/_lib/definitions";

interface Props {
  user: User;
}
export default function MypageDropdown({ user }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onLogout = () => {
    queryClient.removeQueries({
      queryKey: ["store", "info", user.email],
    });
    queryClient.removeQueries({
      queryKey: ["mypage"],
    });
    signOut({ redirect: false }).then(() => {
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
              src={user.image ? user.image : "/Logo.png"}
            />
            {isActive[index] && (
              <div className={styles.dropDownContent} ref={dropdownListRef}>
                {list.map((option: any) => (
                  <div
                    className={styles.contentItem}
                    key={option.name}
                    onClick={() => {
                      option.url === "/myfeed"
                        ? router.push(`/myfeed/${user.email}`)
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
