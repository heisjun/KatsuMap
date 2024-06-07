import styles from "./post.module.css";
export default async function WritePage() {
  return (
    <div className={styles.postContainer}>
      <div className={styles.contentContainer}></div>
    </div>
  );
}
