"use client";

import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styles from "./markerlist.module.css";
import { MdRestaurantMenu, MdAccessTime, MdClose } from "react-icons/md";
import { IKatsuInfo } from "@/model/KatsuInfo";
import ImgSwiper from "../../[postId]/_component/imgSwiper";

interface Props {
  data: IKatsuInfo[];
  idx: number;
  onClose: () => void;
}

export default function SwipeModal({ data, idx, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    handleResize(); // 초기화
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일 Bottom Sheet용 애니메이션 (y축 바인딩)
  const [{ y }, setY] = useSpring(() => ({ y: 0 }));

  const bindY = useDrag(
    ({ down, movement: [, my] }) => {
      // 위로 드래그하는 건 막음 (my < 0일 땐 0으로 고정)
      if (my < 0) my = 0;

      // 아래로 충분히 스와이프했을 때 모달 닫기 애니메이션
      if (!down && my > 150) {
        setY({ y: window.innerHeight }); // 화면 밖으로 밀어냄
        setTimeout(() => onClose(), 250); // 부모 쪽에서 언마운트
      } else {
        // 드래그 중이거나 스와이프가 부족하면 원래 자리로 복귀
        setY({ y: down ? my : 0 });
      }
    },
    { axis: "y" },
  );

  return (
    <animated.div
      className={styles.infoContainer}
      style={{
        transform: isMobile ? y.to((y) => `translate3d(0,${y}px,0)`) : "none",
      }}
    >
      {/* PC 사이드 패널용 닫기 버튼 */}
      <button className={styles.desktopCloseBtn} onClick={onClose}>
        <MdClose size={20} color="#4b5563" />
      </button>

      {/* 모바일 바텀시트용 터치/드래그 핸들 */}
      <div className={styles.scrollBlock} {...(isMobile ? bindY() : {})}>
        <div className={styles.scrollIndicator}></div>
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.infoTitle}>
          <a href={`/${data[idx].post_id}`}>{data[idx].name}</a>
        </div>
        <div className={styles.infoAddress}>{data[idx].address}</div>

        <div className={styles.swiperContainer}>
          <ImgSwiper images={data[idx].image_urls} singleImage={true} />
        </div>

        <div className={styles.textContainer}>
          <div className={styles.contentWrap}>
            <div className={styles.icon}>
              <MdRestaurantMenu />
            </div>
            <div className={styles.infoMenu}>
              {data[idx].menu
                .split(",")
                .map((menuInfo) => menuInfo.split(" "))
                .map((ele, index) => (
                  <div className={styles.category} key={index}>
                    <div className={styles.menuName}>{ele[0]}</div>
                    <div className={styles.menuPrice}>{ele[1]}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.contentWrap}>
            <div className={styles.icon}>
              <MdAccessTime />
            </div>
            <div className={styles.time}>
              {data[idx].time.split("/").map((info, index) => (
                <div key={index} className={styles.addressContent}>
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}
