import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "./imgSwiper.module.css";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  images: string[];
  singleImage?: boolean;
}

export default function ImgSwiper({ images, singleImage }: Props) {
  if (singleImage === true) {
    return (
      <Swiper
        modules={[Pagination]}
        spaceBetween={10} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        pagination={{ clickable: true }}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <div className={styles.swipeBlock}>
              <Image
                src={image} // 이미지 경로
                className={styles.swiperImg} // 기존 스타일 클래스
                alt="돈가스 이미지" // alt 텍스트
                width={400} // 이미지의 고정 너비 또는 원본 크기에 맞는 너비 값 (필수)
                height={400} // 이미지의 고정 높이 또는 원본 크기에 맞는 높이 값 (필수)
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  } else {
    return (
      <Swiper
        modules={[Pagination]}
        spaceBetween={10} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        pagination={{ clickable: true }}
        breakpoints={{
          400: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
        }}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <div className={styles.swipeBlock}>
              <Image
                src={image} // 이미지 경로
                className={styles.swiperImg} // 기존 스타일 클래스
                alt="돈가스 이미지" // alt 텍스트
                width={400} // 이미지의 고정 너비 또는 원본 크기에 맞는 너비 값 (필수)
                height={400} // 이미지의 고정 높이 또는 원본 크기에 맞는 높이 값 (필수)
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
}
