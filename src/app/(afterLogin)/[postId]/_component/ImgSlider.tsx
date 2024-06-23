"use client";

import React, { Key, useEffect, useRef, useState } from "react";
import styles from "./imgSlider.module.css";

interface Props {
  images: string[];
}

export default function ImgSlider({ images }: Props) {
  const slideRef = useRef(document.createElement("img"));
  const [slidePage, setSlidePage] = useState<number>(0);
  const [slideIdx, setSlideIdx] = useState<number>(0);

  const leftButton = () => {
    if (slidePage > 0) {
      setSlidePage((prev: number) => prev - 510);
      setSlideIdx((prev: number) => prev - 1);
    } else {
      setSlidePage((prev: number) => prev + 510 * (images.length - 1));
      setSlideIdx((prev: number) => prev + 1 * (images.length - 1));
    }
  };

  const rightButton = () => {
    if (images.length - 1 > slideIdx) {
      setSlidePage((prev: number) => prev + 510);
      setSlideIdx((prev: number) => prev + 1);
    } else {
      setSlidePage((prev: number) => prev - 510 * (images.length - 1));
      setSlideIdx((prev: number) => prev - 1 * (images.length - 1));
    }
  };

  useEffect(() => {
    slideRef.current.style.transition = "all 0.8s ease-in-out";
    slideRef.current.style.transform = `translateX(-${slidePage}px)`;
  }, [slidePage]);
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div className={styles.btnBox}>
        <div className={styles.arrowStyle} onClick={leftButton}>
          <img src="/prev.png" />
        </div>
        <img className={styles.slash} src="/slash.png" />
        <div className={styles.arrowStyle} onClick={rightButton}>
          <img src="/next.png" />
        </div>
      </div>
      <div className={styles.bannerBox} ref={slideRef}>
        {images.map((image, idx) => (
          <div className={styles.mainBannerContainer} key={idx}>
            <div className={styles.imgContainer}>
              <img src={image} alt="" />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dotBox}>
        {images.map((_, idx) => (
          <div
            className={styles.dot}
            key={idx}
            //slideIdx={slideIdx}
            //idx={idx}
            onClick={() => {
              setSlideIdx(idx);
              setSlidePage(idx * 500);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
