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
}

export default function SwipeModal({ data, idx }: Props) {
  const [{ y, height }, setY] = useSpring(() => ({ y: 350, height: 500 }));
  const [{ x }, setX] = useSpring(() => ({ x: 0 }));
  const [onTop, setOnTop] = useState<boolean>(false);

  const [isWidthLessThan500, setIsWidthLessThan500] = useState(
    window.innerWidth <= 500
  );

  useEffect(() => {
    const handleResize = () => {
      setIsWidthLessThan500(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bindY = useDrag(
    ({ down, movement: [, my], direction: [, dy], cancel }) => {
      const viewportHeight = window.innerHeight;
      if (dy > 0 && my > 100 && !down) {
        // 모달을 화면 아래로 이동시켜 닫기
        setY({ y: viewportHeight, height: viewportHeight - 100 });
        setOnTop(false);
      } else if (dy < 0 && -my > 100 && !down) {
        setY({ y: 0, height: viewportHeight - 100 });
        setOnTop(true);
      } else {
        // 드래그 중일 때, y값과 높이를 설정
        setY({
          y: down ? my : 0,
          height: down ? height.get() : viewportHeight - 100,
        });
        setOnTop(true);
      }
    },
    { axis: "y" }
  );

  const bindX = useDrag(
    ({ down, movement: [mx] }) => {
      setX({ x: down ? mx : mx > 100 ? 350 : 0 });
    },
    { axis: "x" }
  );

  const onCloseModal = () => {
    if (onTop) {
      const viewportHeight = window.innerHeight;
      setY({ y: viewportHeight, height: viewportHeight - 100 });
    }
  };

  return (
    <animated.div
      className={styles.infoContainer}
      style={{
        transform: isWidthLessThan500
          ? y.to((y) => `translate3d(0,${y}px,0)`)
          : x.to((x) => `translate3d(${x}px,0,0)`),
        height: height,
      }}
      {...(isWidthLessThan500 ? bindY() : bindX())}
    >
      <div className={styles.scrollBlock}>
        <div className={styles.scrollIndicator} onClick={onCloseModal}></div>
      </div>
      <div className={styles.infoBlock}>
        <div className={styles.infoTitle}>
          <a href={`/${data[idx].post_id}`}>{data[idx].name}</a>
        </div>
        <div>{data[idx].address}</div>
        <div className={styles.imgContainer}>
          <ImgSwiper images={data[idx].image_urls} singleImage={true} />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.contentWrap}>
            <div className={styles.icon}>
              <MdRestaurantMenu />
            </div>
            <div className={styles.infoMenu}>
              {data[idx].menu
                .split("/")
                .map((menuInfo) => menuInfo.split(" "))
                .map((ele, idx) => (
                  <div className={styles.category} key={idx}>
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
              {data[idx].time.split("/").map((info, idx) => (
                <div key={idx}>
                  <div className={styles.addressContent}>{info}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}
