"use client";

import { useQuery } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { getSingleKatsuInfo } from "../_lib/getSingleKatsuInfo";
import BasicMap from "../../_component/Map";
import styles from "./katsuDetail.module.css";
import ImgSlider from "./ImgSlider";
import { SetStateAction, useEffect, useState } from "react";

interface Props {
  postId: string;
}
export default function KatsuDetail({ postId }: Props) {
  const [tableData, setTableData] = useState();
  const [message, setMessage] = useState("");
  const [view, setView] = useState(false);
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
  const onWaiting = async () => {
    setView(false);
    if (!store?.table_id) {
      setMessage("웨이팅어플과 연동되지 않았습니다");
      setView(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/waiting/${store?.table_id}`
      );

      if (!response.ok) {
        throw new Error("웨이팅어플과 연동되지 않았습니다");
      }

      const result = await response.json();
      const { operationInfo, totalTeamCount } = result;

      if (!operationInfo.isWaitingAvailable) {
        handleWaitingDisabled(operationInfo, totalTeamCount);
      } else {
        setTableData(totalTeamCount);
      }
    } catch (error) {
      setMessage("다시 시도하세요");
    } finally {
      setView(true);
    }
  };

  const handleWaitingDisabled = (
    operationInfo: { waitingDisabledReason: any },
    totalTeamCount: SetStateAction<undefined>
  ) => {
    const { waitingDisabledReason } = operationInfo;

    if (waitingDisabledReason === "UNDER_AVAILABLE_TEAMS" || "BY_PASS") {
      setTableData(totalTeamCount);
    } else {
      setMessage(waitingDisabledReason);
    }
  };

  useEffect(() => {
    onWaiting();
  }, []);

  if (error) {
    return <div>데이터없음</div>;
  }
  if (!store) {
    return null;
  }

  return (
    view && (
      <div className={styles.detailContainer}>
        <div className={styles.detailHeader}>
          <div className={styles.detailTitle}>{store.title}</div>
        </div>

        <span> {message ? message : <div>현재대기{tableData}</div>}</span>

        <ImgSlider images={store.image_urls} />
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
    )
  );
}
