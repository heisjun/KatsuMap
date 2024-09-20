import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import styles from "./bannerSwiper.module.css";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

interface Props {
  infos: { banner: string; goto: string }[];
}

export default function BannerSwiper({ infos }: Props) {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      navigation
      spaceBetween={20} // 슬라이스 사이 간격
      slidesPerView={1} // 보여질 슬라이스 수
      pagination={{ clickable: true }}
      breakpoints={{
        400: {
          slidesPerView: 1,
        },
        600: {
          slidesPerView: 1,
        },
        1000: {
          slidesPerView: 1.5,
        },
      }}
    >
      {infos.map((ele, idx) => (
        <SwiperSlide key={idx}>
          <Link href={ele.goto}>
            <div className={styles.swipeBlock}>
              <Image
                src={ele.banner} // 이미지 경로
                className={styles.swiperImg} // 기존 스타일 클래스
                alt="돈가스 이미지" // alt 텍스트
                width={800} // 이미지의 고정 너비 또는 원본 크기에 맞는 너비 값 (필수)
                height={350} // 이미지의 고정 높이 또는 원본 크기에 맞는 높이 값 (필수)
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
