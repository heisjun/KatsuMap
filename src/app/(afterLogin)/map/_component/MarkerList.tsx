"use client";

import styles from "@/app/(afterLogin)/map/_component/markerlist.module.css";
import { MdAdd, MdGpsFixed, MdHorizontalRule } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { CustomOverlayMap, MapMarker, useMap } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";
import useGeolocation from "../../_component/useGeolocation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

  const setCenterToMyPosition = () => {
    setCenter(position);
  };
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState([false]);

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

  const EventMarkerContainer = ({ position, index, name }: any) => {
    const map = useMap();

    function onOpenBtn(index: number) {
      const newIsActive = [];
      newIsActive[index] = true;
      setIsOpen(newIsActive);
    }

    function onCloseBtn(index: number) {
      const newIsActive = [...isOpen];
      newIsActive[index] = false;
      setIsOpen(newIsActive);
    }

    const isSelected = selectedMarker === index;

    return (
      <>
        <MapMarker
          position={position} // 마커를 표시할 위치
          onClick={(marker) => {
            map.panTo(marker.getPosition());
            isOpen[index] ? onCloseBtn(index) : onOpenBtn(index);
            setSelectedMarker(index);
          }}
          image={{
            src: isSelected
              ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
              : "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
            size: { width: 24, height: 35 },
          }}
        ></MapMarker>
        <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
          // 커스텀 오버레이가 표시될 위치입니다
          position={{
            lat: Number(position.lat),
            lng: Number(position.lng),
          }}
          yAnchor={0}
        >
          {/* 커스텀 오버레이에 표시할 내용입니다 */}
          <div className={styles.infoWrapper}>
            <span className={styles.storeName}>{name}</span>
          </div>
        </CustomOverlayMap>
      </>
    );
  };

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
                  }} // 마커를 표시할 위치
                  index={idx}
                  name={item.name}
                />
                {isOpen[idx] && <SwipeModal data={data} idx={idx} />}
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
