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
                src={image}
                className={styles.swiperImg}
                alt="돈가스 썸네일"
                fill
                sizes="(max-width: 600px) 100vw, 400px"
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
                src={image}
                className={styles.swiperImg}
                alt="돈가스 썸네일"
                fill
                sizes="(max-width: 1000px) 50vw, 33vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
}
