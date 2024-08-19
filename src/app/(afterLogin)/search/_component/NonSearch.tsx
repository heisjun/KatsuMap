import styles from "./nonSearch.module.css";

export default function NonSearch() {
  return (
    <div className={styles.nonSearchContainer}>
      <span>앗! 찾으시는 결과가 없네요.</span>
    </div>
  );
}
