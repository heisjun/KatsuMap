"use client";
import Image from "next/image";
import {
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FaFileImage } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import styles from "./uploadform.module.css";

const UploadForm = forwardRef((props, ref) => {
  const [previewImgs, setPreviewImgs] = useState<FileList | null>();

  // 이미지 저장
  const saveHandler = async () => {
    if (!previewImgs) {
      return;
    }

    const formData = new FormData();
    Array.from(previewImgs).forEach((file) => {
      formData.append("img", file);
    });

    const result = await fetch("/api/s3-upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (result.message === "OK" && result.urls) {
      return result.urls;
    }

    return null;
  };

  // 이미지 미리보기
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;

    if (newFiles && newFiles.length > 0) {
      if (previewImgs) {
        // 기존 FileList와 새 FileList를 File[]로 변환하여 병합
        const combinedFiles = Array.from(previewImgs).concat(
          Array.from(newFiles)
        );
        // File[]에서 다시 FileList 생성
        const dataTransfer = new DataTransfer();
        combinedFiles.forEach((file) => dataTransfer.items.add(file));

        setPreviewImgs(dataTransfer.files);
      } else {
        setPreviewImgs(newFiles);
      }
    }
  };

  const removeImage = (index: number) => {
    if (!previewImgs) return;

    const dataTransfer = new DataTransfer();
    Array.from(previewImgs).forEach((file, i) => {
      if (i !== index) dataTransfer.items.add(file);
    });

    setPreviewImgs(dataTransfer.files);
  };

  useImperativeHandle(ref, () => ({
    saveHandler,
  }));

  const imgRef = useRef<any>(null);
  const onClickFileBtn = (e: any) => {
    imgRef.current.click();
  };

  return (
    <div className={styles.container}>
      {previewImgs && (
        <div className={styles.previewContainer}>
          {Array.from(previewImgs).map((file, index) => (
            <div key={index} className={styles.imageBlock}>
              <Image
                src={URL.createObjectURL(file)}
                alt="이미지 미리보기"
                width={150}
                height={150}
                className={styles.image}
              />
              <TiDelete
                className={styles.removeBtn}
                onClick={() => removeImage(index)}
              />
            </div>
          ))}
        </div>
      )}
      <div className={styles.form} onClick={onClickFileBtn}>
        <FaFileImage className={styles.uploadIcon} />
        <span>Image Upload</span>
        <input
          type="file"
          multiple
          onChange={(e) => fileHandler(e)}
          ref={imgRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
});

UploadForm.displayName = "UploadForm";

export default UploadForm;
