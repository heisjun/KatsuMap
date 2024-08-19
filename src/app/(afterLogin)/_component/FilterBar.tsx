"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import styles from "./filterBar.module.css";
import cx from "classnames";

const FilterComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get("order");
  const onChangePopular = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("order", "popular");
    if (pathname === "/search") {
      router.replace(`/search?${newSearchParams.toString()}`);
    } else {
      router.replace(`/?${newSearchParams.toString()}`);
    }
  };
  const onChangeRecent = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("order");
    if (pathname === "/search") {
      router.replace(`/search?${newSearchParams.toString()}`);
    } else {
      router.replace(`/?${newSearchParams.toString()}`);
    }
  };

  return (
    <div className={styles.filterbarContainer}>
      <span onClick={onChangeRecent} className={cx(!search && styles.selected)}>
        최신순
      </span>
      <div className={styles.boundary} />
      <span onClick={onChangePopular} className={cx(search && styles.selected)}>
        인기순
      </span>
    </div>
  );
};

export default FilterComponent;
