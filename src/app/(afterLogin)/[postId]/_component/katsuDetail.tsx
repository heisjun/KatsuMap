"use client";

import { useQuery } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { getSingleKatsuInfo } from "../_lib/getSingleKatsuInfo";
import BasicMap from "../../_component/Map";
import styles from "./katsuDetail.module.css";
import ImgSlider from "./ImgSlider";

interface Props {
  postId: string;
}
export default function KatsuDetail({ postId }: Props) {
  const { data: store, error } = useQuery<
    IKatsuInfo,
    Object,
    IKatsuInfo,
    [_1: string, _2: string]
  >({
    queryKey: ["store", postId],
    queryFn: getSingleKatsuInfo,
    //staleTime: 0,
    //gcTime: 300 * 1000,
  });

  if (error) {
    return <div>데이터없음</div>;
  }
  if (!store) {
    return null;
  }
  const testData = [
    { picUrl: store.image_url },
    { picUrl: store.image_url },
    { picUrl: store.image_url },
  ];

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailTitle}>{store.title}</div>
      <ImgSlider data={testData} />
      <div className={styles.infoContainer}>
        <div className={styles.infoBlockLeft}>
          <div className={styles.storeName}>{store.name}</div>
          {store.explain.split("<br>").map((content, idx) => (
            <div key={idx}>
              <span className={styles.storeExplain}>{content}</span>
              <br />
              <br />
            </div>
          ))}
        </div>
        <div className={styles.infoBlockRight}>
          <div className={styles.infoAdress}>주소</div>
          <div className={styles.addressContent}>{store.address}</div>
          <div className={styles.infoAdress}>메뉴</div>
          <div className={styles.flexContainer}>
            {store.menu
              .split("/")
              .map((menuInfo) => menuInfo.split(" "))
              .map((ele, idx) => (
                <div className={styles.category} key={idx}>
                  <div className={styles.menuName}>{ele[0]}</div>
                  <div className={styles.menuPrice}>{ele[1]}</div>
                </div>
              ))}
          </div>
          <div className={styles.infoAdress}> 영업시간</div>
          {store.time.split("/").map((info, idx) => (
            <div key={idx}>
              <div className={styles.addressContent}>{info}</div>
            </div>
          ))}
        </div>
      </div>
      <BasicMap store={store} />
    </div>
  );
}
