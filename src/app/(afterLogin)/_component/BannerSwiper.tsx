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
      style={{ width: "100%", height: "100%" }}
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
          <Link href={ele.goto} style={{ display: "block", width: "100%" }}>
            <div className={styles.swipeBlock}>
              <Image
                src={ele.banner}
                className={styles.swiperImg}
                alt="돈가스 배너 이미지"
                fill /* 부모(.swipeBlock) 크기를 꽉 채웁니다 */
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 100vw, 800px"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
