"use client";
import { useState, SetStateAction, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import styles from "./waitingIndicator.module.css";
interface Props {
  tableId: string | null;
  engName?: string;
}
export default function WaitingIndicator({ tableId, engName }: Props) {
  const [tableData, setTableData] = useState();
  const [message, setMessage] = useState("");

  const onGoCatchTable = () => {
    const url = `https://app.catchtable.co.kr/ct/shop/${engName}`;
    window.open(url);
  };
  const onWaiting = async () => {
    if (!tableId) {
      setMessage("웨이팅어플과 연동되지 않았습니다");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/waiting/${tableId}`
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
    }
  };

  useEffect(() => {
    onWaiting();
  }, []);

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
  return (
    <div className={styles.indicatorContainer} onClick={onGoCatchTable}>
      <div className={styles.indicatorHeader}>대기</div>
      <div className={styles.indicatorContent}>
        <span>{tableData}</span>팀
      </div>
      <div
        className={styles.refresh}
        onClick={(event) => {
          event.stopPropagation();
          onWaiting();
        }}
      >
        <MdOutlineRefresh style={{ fontSize: 15, color: "#FF5000" }} />
      </div>
    </div>
  );
}
