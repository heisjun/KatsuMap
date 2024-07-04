import React from "react";
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
  const [{ y, x, height }, set] = useSpring(() => ({
    y: 350,
    x: 0,
    height: 500,
  }));

  const bindY = useDrag(
    ({ down, movement: [, my], direction: [, dy], cancel }) => {
      const viewportHeight = window.innerHeight;
      if (dy > 0 && my > 100 && !down) {
        // 모달을 화면 아래로 이동시켜 닫기
        set({ y: viewportHeight, height: viewportHeight - 96 });
      } else if (dy < 0 && -my > 100 && !down) {
        // 모달의 높이를 500px로 설정
        set({ y: 0, height: viewportHeight - 96 });
      } else {
        // 드래그 중일 때, y값과 높이를 설정
        set({
          y: down ? my : 0,
          height: down ? height.get() : viewportHeight - 96,
        });
      }
    },
    { axis: "y" }
  );

  const bindX = useDrag(
    ({ down, movement: [mx] }) => {
      set({ x: down ? mx : mx > 100 ? 350 : 0 });
    },
    { axis: "x" }
  );

  return (
    <animated.div
      className={styles.infoContainer}
      style={{
        transform: y.to((y) => `translate3d(0,${y}px,0)`),
        height: height,
      }}
      {...bindY()}
    >
      <div className={styles.scrollBlock}>
        <div className={styles.scrollIndicator}></div>
      </div>
      <div className={styles.infoBlock}>
        <div className={styles.infoTitle}>
          <a href={`/${data[idx].post_id}`}>{data[idx].name}</a>
        </div>
        <div>{data[idx].address}</div>
        <div className={styles.imgContainer}>
          <ImgSwiper images={data[idx].image_urls} />
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
