"use client";

import styles from "@/app/(afterLogin)/map/_component/markerlist.module.css";
import { MdAdd, MdGpsFixed, MdHorizontalRule } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { CustomOverlayMap, MapMarker, useMap } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";
import useGeolocation from "../../_component/useGeolocation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import SwipeModal from "./SwipeModal";
import LoadingSpinner from "../../_component/LoadingSpinner";

interface LatLng {
  lat: number;
  lng: number;
}

type Props = {
  searchParams: { order: string };
};
// EventMarkerContainer를 컴포넌트 외부로 분리하여 불필요한 재생성을 방지합니다.
const EventMarkerContainer = React.memo(({ 
  position, 
  index, 
  name, 
  isOpen, 
  isSelected,
  onToggleOpen,
  onSelectMarker
}: {
  position: LatLng;
  index: number;
  name: string;
  isOpen: boolean;
  isSelected: boolean;
  onToggleOpen: (index: number) => void;
  onSelectMarker: (index: number) => void;
}) => {
  const map = useMap();

  return (
    <>
      <MapMarker
        position={position}
        onClick={(marker) => {
          map.panTo(marker.getPosition());
          onToggleOpen(index);
          onSelectMarker(index);
        }}
        image={{
          src: isSelected
            ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
            : "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
          size: { width: 24, height: 35 },
        }}
      ></MapMarker>
      <CustomOverlayMap
        position={{
          lat: Number(position.lat),
          lng: Number(position.lng),
        }}
        yAnchor={0}
      >
        <div className={styles.infoWrapper}>
          <span className={styles.storeName}>{name}</span>
        </div>
      </CustomOverlayMap>
    </>
  );
});
EventMarkerContainer.displayName = "EventMarkerContainer";

export default function MarkerList() {
  const session = useSession();
  const user_email = session.data?.user?.email as string;
  const { data } = useQuery<
    IKatsuInfo[],
    Object,
    IKatsuInfo[],
    [_1: string, _2: string, user_email: string, Props["searchParams"]]
  >({
    queryKey: ["store", "info", user_email, { order: "popular" }],
    queryFn: getStoreInfo,
  });
  const location = useGeolocation();

  const [center, setCenter] = useState<LatLng>({
    lat: 33.450701,
    lng: 126.570667,
  });

  const [position, setPosition] = useState<LatLng>({
    lat: 33.450701,
    lng: 126.570667,
  });

  const setCenterToMyPosition = React.useCallback(() => {
    setCenter(position);
  }, [position]);
  
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  // 지도 중심좌표 이동 감지 시 이동된 중심좌표로 설정
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map: kakao.maps.Map) => {
        setCenter({
          lat: map.getCenter().getLat(),
          lng: map.getCenter().getLng(),
        });
      }, 500),
    []
  );

  // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    const watchId = navigator.geolocation.watchPosition((pos) => {
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    
    return () => navigator.geolocation.clearWatch(watchId); // 클린업 로직 추가
  }, []);

  const mapRef = useRef<kakao.maps.Map>(null);
  const defaultLevel = 3;
  const [level, setLevel] = useState(defaultLevel);

  const handleLevel = React.useCallback((type: "increase" | "decrease") => {
    const map = mapRef.current;
    if (!map) return;

    if (type === "increase") {
      map.setLevel(map.getLevel() + 1);
      setLevel(map.getLevel());
    } else {
      map.setLevel(map.getLevel() - 1);
      setLevel(map.getLevel());
    }
  }, []);

  const handleMarkerSelect = React.useCallback((index: number) => {
    setSelectedMarker((prev) => (prev === index ? null : index)); // 이미 열려있으면 닫기, 아니면 열기
  }, []);

  return (
    <div className={styles.mainWrapper}>
      {!location.loaded ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Map // 지도를 표시할 Container
            center={center}
            className={styles.map}
            level={defaultLevel} // 지도의 확대 레벨
            zoomable={true}
            ref={mapRef}
            onCenterChanged={updateCenterWhenMapMoved}
          >
            {/* 현위치 마커 */}
            <MapMarker
              position={position} // 마커를 표시할 위치
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/2018/mw/m640/ico_marker.png",
                size: { width: 30, height: 30 },
              }}
            />
            {/* 모든 돈까스집 마커 */}
            {data?.map((item: IKatsuInfo, idx) => (
              <Fragment key={`${item.lat}-${item.lng}`}>
                <EventMarkerContainer
                  position={{
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  }}
                  index={idx}
                  name={item.name}
                  isOpen={selectedMarker === idx}
                  isSelected={selectedMarker === idx}
                  onToggleOpen={handleMarkerSelect}
                  onSelectMarker={setSelectedMarker}
                />
                {selectedMarker === idx && (
                  <SwipeModal 
                    data={data} 
                    idx={idx} 
                    onClose={() => handleMarkerSelect(idx)} 
                  />
                )}
              </Fragment>
            ))}
          </Map>
          <div className={styles.iconWrapper}>
            <button
              className={styles.positionIcon}
              onClick={setCenterToMyPosition}
            >
              <MdGpsFixed style={{ fontSize: 20, color: "black" }} />
            </button>
            <div>
              <button
                onClick={() => handleLevel("decrease")}
                className={styles.decreaseBtn}
              >
                <MdAdd style={{ fontSize: 20, color: "black" }} />
              </button>
              <button
                onClick={() => handleLevel("increase")}
                className={styles.increaseBtn}
              >
                <MdHorizontalRule style={{ fontSize: 20, color: "black" }} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
