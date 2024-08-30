"use client";
import { IUser } from "@/model/User";
import styles from "./editForm.module.css";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

interface Props {
  user: IUser;
}

export default function EditForm({ user }: Props) {
  function convertProvider(provider: string | null) {
    if (provider === null) {
      return "katsumap으";
    } else if (provider === "kakao") {
      return "카카오";
    } else if (provider === "naver") {
      return "네이버";
    }
  }

  const [nickname, setNickname] = useState(user.nickname || "");
  const [previewImg, setPreviewImg] = useState<File | null>(null);

  // 이미지 저장
  const saveHandler = async () => {
    if (!previewImg) {
      return;
    }

    const formData = new FormData();
    formData.append("img", previewImg);

    const result = await fetch("/api/s3-upload-profile", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (result.message === "OK" && result.url) {
      // urls 대신 url로 변경
      return result.url;
    }

    return null;
  };

  // 이미지 미리보기
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0]; // 단일 파일 선택

    if (newFile) {
      setPreviewImg(newFile); // 단일 파일로 설정
    }
  };

  const removeImage = () => {
    setPreviewImg(null); // 이미지 제거 시 null로 설정
  };

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 막기

    // saveHandler()가 완료될 때까지 기다림
    const imageUrl = await saveHandler();

    // imageUrl이 없으면 중단
    if (!imageUrl) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }
    try {
      // 이미지 파일이 선택된 경우에만 업로드 수행

      const response = await fetch(`/api/mypage/${user.email}/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, image: imageUrl }), // 이미지 URL을 API에 전달
      });

      if (response.ok) {
        alert("프로필이 성공적으로 업데이트되었습니다.");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };
  const imgRef = useRef<any>(null);

  const onClickFileBtn = (e: any) => {
    imgRef.current.click();
  };

  return (
    <div className={styles.editContainer}>
      <form className={styles.editContent} onSubmit={updateProfile}>
        <div className={styles.photoBlock}>
          {previewImg ? (
            <img
              src={URL.createObjectURL(previewImg)}
              className={styles.editPhoto}
              onClick={onClickFileBtn}
            />
          ) : (
            <img
              src={user.image ? user.image : "/avatar.png"}
              className={styles.editPhoto}
              onClick={onClickFileBtn}
            />
          )}
          <span onClick={removeImage}>이미지 삭제</span>
          <div className={styles.form} onClick={onClickFileBtn}>
            <input
              type="file"
              multiple
              onChange={(e) => fileHandler(e)}
              ref={imgRef}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className={styles.contentBlock}>
          <label className={styles.editLabel}>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className={styles.contentBlock}>
          <label className={styles.editLabel}>이메일</label>
          <input type="text" placeholder={user.email} disabled />
          <div className={styles.infoText}>
            {convertProvider(user.provider)}로 가입한 계정이예요.
          </div>
        </div>
        <hr />
        <button type="submit" className={styles.submitBtn}>
          완료
        </button>
      </form>
    </div>
  );
}
