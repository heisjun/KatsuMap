import styles from "./loadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.dot_spinner}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}
