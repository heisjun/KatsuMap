"use client";

import styles from "@/app/(afterLogin)/map/_component/markerlist.module.css";
import {
  MdAdd,
  MdGpsFixed,
  MdHorizontalRule,
  MdRestaurantMenu,
  MdAccessTime,
  MdLocationPin,
  MdArrowForwardIos,
} from "react-icons/md";
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

  const [isOpen, setIsOpen] = useState([false]);

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

  const EventMarkerContainer = ({ position, index }: any) => {
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

    return (
      <MapMarker
        position={position} // 마커를 표시할 위치
        onClick={(marker) => {
          map.panTo(marker.getPosition());
          isOpen[index] ? onCloseBtn(index) : onOpenBtn(index);
        }}
      ></MapMarker>
    );
  };

  return (
    <div className={styles.mainWrapper}>
      {!location.loaded ? (
        <div>로딩중</div>
      ) : (
        <>
          <Map // 지도를 표시할 Container
            center={center}
            style={{
              // 지도의 크기
              width: "100%",
              height: "500px",
              position: "relative",
              zIndex: 1,
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
            {data?.map((item: IKatsuInfo, idx) => (
              <Fragment key={`${item.lat}-${item.lng}`}>
                <EventMarkerContainer
                  position={{
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  }} // 마커를 표시할 위치
                  index={idx}
                />
                <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
                  // 커스텀 오버레이가 표시될 위치입니다
                  position={{
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  }}
                  yAnchor={0}
                >
                  {/* 커스텀 오버레이에 표시할 내용입니다 */}
                  <div className={styles.infoWrapper}>
                    <span className={styles.storeName}>{item.name}</span>
                  </div>
                </CustomOverlayMap>
                {isOpen[idx] && (
                  <div className={styles.infoContainer}>
                    <div
                      className={styles.infoCloseBtn}
                      onClick={() => setIsOpen([false])}
                      title="닫기"
                    >
                      <MdArrowForwardIos style={{ fontSize: 15 }} />
                    </div>
                    <img
                      className={styles.infoImg}
                      src={data[idx].image_url}
                      alt={`${data[idx].name}`}
                    />
                    <div className={styles.infoTitle}>{data[idx].name}</div>
                    <div className={styles.contentWrap}>
                      <div className={styles.icon}>
                        <MdRestaurantMenu />
                      </div>
                      <div className={styles.infoMenu}>
                        {data[idx].menu
                          .split("/")
                          .map((menuInfo) => menuInfo.split(" "))
                          .map((ele, idx) => (
                            <div className={styles.category} key={idx}>
                              <div className={styles.menuName}>{ele[0]}</div>
                              <div className={styles.menuPrice}>{ele[1]}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className={styles.contentWrap}>
                      <div className={styles.icon}>
                        <MdAccessTime />
                      </div>
                      <div className={styles.time}>
                        {data[idx].time.split("/").map((info, idx) => (
                          <div key={idx}>
                            <div className={styles.addressContent}>{info}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.contentWrap}>
                      <div className={styles.icon}>
                        <MdLocationPin />
                      </div>
                      <div className="ellipsis">{data[idx].address}</div>
                    </div>

                    <div>
                      <a
                        href={`/${data[idx].post_id}`}
                        target="_blank"
                        className="link"
                        rel="noreferrer"
                      >
                        상세정보
                      </a>
                    </div>
                  </div>
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
