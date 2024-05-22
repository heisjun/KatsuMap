import styles from "@/app/(afterLogin)/_component/katsuInfo.module.css";
import { IKatsuInfo } from "@/model/KatsuInfo";
import KatsuArticle from "./KatsuArticle";

type Props = {
  info: IKatsuInfo;
};
export default function KatsuInfo({ info }: Props) {
  let target = info;
  return (
    <KatsuArticle post={target}>
      <img src={info.image} className={styles.storeImage} />
      <div className={styles.storeTitle}>제목</div>
      <div className={styles.storeName}>가게이름</div>
      <div className={styles.storeLocation}>위치</div>
    </KatsuArticle>
  );
}
