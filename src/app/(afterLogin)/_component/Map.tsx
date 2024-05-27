"use client";
import styles from "@/app/(afterLogin)/_component/map.module.css";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";

type Props = {
  store: IKatsuInfo;
};

export default function BasicMap({ store }: Props) {
  return (
    <Map // 지도를 표시할 Container
      id="map"
      center={{
        // 지도의 중심좌표
        lat: Number(store.location.lat),
        lng: Number(store.location.lng),
      }}
      style={{
        // 지도의 크기
        width: "350px",
        height: "350px",
      }}
      level={3} // 지도의 확대 레벨
    >
      <MapMarker // 마커를 생성합니다
        position={{
          // 마커가 표시될 위치입니다
          lat: Number(store.location.lat),
          lng: Number(store.location.lng),
        }}
      ></MapMarker>
      <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
        // 커스텀 오버레이가 표시될 위치입니다
        position={{
          lat: Number(store.location.lat),
          lng: Number(store.location.lng),
        }}
        yAnchor={0}
      >
        {/* 커스텀 오버레이에 표시할 내용입니다 */}
        <div className={styles.infoWrapper}>
          <span className={styles.storeName}>{store.name}</span>
        </div>
      </CustomOverlayMap>
    </Map>
  );
}
