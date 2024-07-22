import PostForm from "./_components/PostForm";
import styles from "./post.module.css";

export default async function WritePage() {
  return (
    <div className={styles.postContainer}>
      <PostForm />
    </div>
  );
}
