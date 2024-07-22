// uploadForm.module.css
import Image from "next/image";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import styles from "./uploadform.module.css";

type UploadFormProps = {
  onUploadComplete: (urls: string[]) => void;
};

const UploadForm = forwardRef(({ onUploadComplete }: UploadFormProps, ref) => {
  const [previewImgs, setPreviewImgs] = useState<FileList>();

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
      onUploadComplete(result.urls);
      return result.urls;
    }

    return null;
  };

  // 이미지 미리보기
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setPreviewImgs(files);
    }
  };

  useImperativeHandle(ref, () => ({
    saveHandler,
  }));

  return (
    <main>
      <div className={styles.container}>
        <form className={styles.form}>
          {/* 파일 업로드  */}
          <input type="file" multiple onChange={(e) => fileHandler(e)} />

          {/* 이미지 미리보기  */}
          {previewImgs && (
            <div className={styles.previewContainer}>
              {Array.from(previewImgs).map((file, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="이미지 미리보기"
                  width={100}
                  height={100}
                />
              ))}
            </div>
          )}
        </form>
      </div>
    </main>
  );
});

UploadForm.displayName = "UploadForm";

export default UploadForm;
