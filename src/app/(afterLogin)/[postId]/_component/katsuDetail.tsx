"use client";

import { useQuery } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { getSingleKatsuInfo } from "../_lib/getSingleKatsuInfo";
import BasicMap from "../../_component/Map";
import styles from "./katsuDetail.module.css";
import ImgSwiper from "./imgSwiper";
import WaitingIndicator from "./WaitingIndicator";
import DetailInfo from "./DetailInfo";
import DetailMenu from "./DetailMenu";

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

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitle}>{store.title}</div>
        {store.table_id && (
          <WaitingIndicator tableId={store.table_id} engName={store.eng_name} />
        )}
      </div>

      <ImgSwiper images={store.image_urls} />
      <div className={styles.infoContainer}>
        <DetailInfo storeName={store.name} explain={store.explain} />
        <DetailMenu address={store.address} menuString={store.menu} timeString={store.time} />
      </div>
      <BasicMap store={store} />
    </div>
  );
}
