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
      <div className={styles.storeTitle}>{info.title}</div>
      <div className={styles.storeName}>{info.name}</div>
      <div className={styles.storeLocation}>주소</div>
    </KatsuArticle>
  );
}
