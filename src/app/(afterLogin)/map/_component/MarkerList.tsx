"use client";

import styles from "@/app/(afterLogin)/map/_component/markerlist.module.css";
import { MdAdd, MdGpsFixed, MdHorizontalRule } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuInfo from "../../_component/KatsuInfo";
import { CustomOverlayMap, MapMarker, useMap } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";
import useGeolocation from "../../_component/useGeolocation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";

interface LatLng {
  lat: number;
  lng: number;
}
export default function MarkerList() {
  const { data } = useQuery<IKatsuInfo[], Object, IKatsuInfo[]>({
    queryKey: ["store", "info"],
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

  const setCenterToMyPosition = () => {
    setCenter(position);
  };

  // 지도 중심좌표 이동 감지 시 이동된 중심좌표로 설정
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map: kakao.maps.Map) => {
        console.log(map.getCenter());
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

    navigator.geolocation.watchPosition((pos) => {
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const mapRef = useRef<kakao.maps.Map>(null);
  const defaultLevel = 3;
  const [level, setLevel] = useState(defaultLevel);

  const handleLevel = (type: "increase" | "decrease") => {
    const map = mapRef.current;
    if (!map) return;

    if (type === "increase") {
      map.setLevel(map.getLevel() + 1);
      setLevel(map.getLevel());
    } else {
      type === "decrease";
      map.setLevel(map.getLevel() - 1);
      setLevel(map.getLevel());
    }
  };

  const EventMarkerContainer = ({ position }: any) => {
    const map = useMap();

    return (
      <MapMarker
        position={position} // 마커를 표시할 위치
        onClick={(marker) => map.panTo(marker.getPosition())}
      ></MapMarker>
    );
  };

  return (
    <div className={styles.mainWrapper}>
      {location.loaded && (
        <Map // 지도를 표시할 Container
          center={center}
          style={{
            // 지도의 크기
            width: "1400px",
            height: "500px",
            position: "relative",
          }}
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
          {data?.map((item: IKatsuInfo) => (
            <Fragment key={`${item.location.lat}-${item.location.lng}`}>
              <EventMarkerContainer
                position={{
                  lat: Number(item.location.lat),
                  lng: Number(item.location.lng),
                }} // 마커를 표시할 위치
                title={item.name} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              />
              <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
                // 커스텀 오버레이가 표시될 위치입니다
                position={{
                  lat: Number(item.location.lat),
                  lng: Number(item.location.lng),
                }}
                yAnchor={0}
              >
                {/* 커스텀 오버레이에 표시할 내용입니다 */}
                <div className={styles.infoWrapper}>
                  <span className={styles.storeName}>{item.name}</span>
                </div>
              </CustomOverlayMap>
            </Fragment>
          ))}
        </Map>
      )}
      <div className={styles.iconWrapper}>
        <button className={styles.positionIcon} onClick={setCenterToMyPosition}>
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
    </div>
  );
}
