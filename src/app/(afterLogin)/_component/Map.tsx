"use client";

import { IKatsuInfo } from "@/model/KatsuInfo";
import {
  MapMarker,
  useKakaoLoader as useKakaoLoaderOrigin,
} from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";

function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: process.env.KAKAOJSKEY as string,
    libraries: ["clusterer", "drawing", "services"],
  });
}

type Props = {
  store: IKatsuInfo;
};

export default function BasicMap({ store }: Props) {
  useKakaoLoader();

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
      />
      <div style={{ padding: "5px", color: "#000" }}>
        {store.name} <br />
        <a
          href={`https://map.kakao.com/link/to/${store.name},${Number(
            store.location.lat
          )},${Number(store.location.lng)}`}
          style={{ color: "blue" }}
          target="_blank"
          rel="noreferrer"
        >
          길찾기
        </a>
      </div>
    </Map>
  );
}
