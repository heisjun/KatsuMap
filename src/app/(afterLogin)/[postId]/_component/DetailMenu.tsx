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

      <div className={styles.infoAdress}> 영업시간</div>
      {timeString.split("/").map((info, idx) => (
        <div key={idx}>
          <div className={styles.addressContent}>{info}</div>
        </div>
      ))}
    </div>
  );
}
