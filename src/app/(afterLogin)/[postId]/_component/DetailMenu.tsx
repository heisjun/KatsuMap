import styles from "./katsuDetail.module.css";

interface Props {
  address: string;
  menuString: string;
  timeString: string;
}

export default function DetailMenu({ address, menuString, timeString }: Props) {
  return (
    <div className={styles.infoBlockRight}>
      <div className={styles.infoAdress}>주소</div>
      <div className={styles.addressContent}>{address}</div>

      <div className={styles.infoAdress}>메뉴</div>
      <div className={styles.flexContainer}>
        {menuString
          .split(",")
          .map((menuInfo) => menuInfo.split(" "))
          .map((ele, idx) => (
            <div className={styles.category} key={idx}>
              <div className={styles.menuName}>{ele[0]}</div>
              <div className={styles.menuPrice}>{ele[1]}</div>
            </div>
          ))}
      </div>

      <div className={styles.infoAdress}>영업시간</div>
      {timeString.split("/").map((info, idx) => {
        const isClosed =
          info.includes("휴무") ||
          info.includes("쉬는") ||
          info.includes("휴일") ||
          info.includes("Off");
        return (
          <div key={idx}>
            <div
              className={`${styles.addressContent} ${isClosed ? styles.closedHighlight : ""}`}
            >
              {info}
            </div>
          </div>
        );
      })}
    </div>
  );
}
