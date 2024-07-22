import { useState } from "react";
import styles from "./toggleBtn.module.css";

type Props = {
  isOn: boolean;
  setisOn: any;
};
export const ToggleBtn = ({ isOn, setisOn }: Props) => {
  const toggleHandler = () => {
    setisOn(!isOn);
  };

  return (
    <>
      <div className={styles.toggleContainer} onClick={toggleHandler}>
        <div
          className={`${styles.toggleContainer1} ${
            isOn ? styles.toggleChecked : ""
          }`}
        />
        <div
          className={`${styles.toggleCircle} ${
            isOn ? styles.toggleChecked : ""
          }`}
        />
      </div>
    </>
  );
};
