import { Metadata } from "next";
import PostForm from "./_components/PostForm";
import styles from "./post.module.css";

export const metadata: Metadata = {
  title: "글쓰기",
  description: "글을 작성해 보세요",
};

export default async function WritePage() {
  return (
    <div className={styles.postContainer}>
      <PostForm />
    </div>
  );
}
