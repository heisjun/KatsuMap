import styles from "./post.module.css";
import LogoutBtn from "../../_component/LogoutBtn";
import { auth } from "@/auth";

export default async function WritePage() {
  const session = await auth();
  return (
    <div className={styles.postContainer}>
      <div className={styles.contentContainer}></div>
      <LogoutBtn me={session} />
    </div>
  );
}
