import styles from "./katsuDetail.module.css";

interface Props {
  storeName: string;
  explain: string;
}

export default function DetailInfo({ storeName, explain }: Props) {
  return (
    <div className={styles.infoBlockLeft}>
      <div className={styles.storeName}>{storeName}</div>
      {explain.split("<br>").map((content, idx) => (
        <p key={idx} className={styles.storeExplain}>
          {content}
          <br />
          <br />
        </p>
      ))}
    </div>
  );
}
