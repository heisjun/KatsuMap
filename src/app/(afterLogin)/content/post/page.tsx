import styles from "./post.module.css";
import { auth } from "@/auth";

export default async function WritePage() {
  const session = await auth();
  return (
    <div className={styles.postContainer}>
      <div className={styles.contentContainer}></div>
    </div>
  );
}
