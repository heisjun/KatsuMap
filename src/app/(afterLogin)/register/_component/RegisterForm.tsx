"use client";
import styles from "./registerForm.module.css";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../_component/LoadingSpinner";

export default function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordChk, setPasswordChk] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [previewImg, setPreviewImg] = useState<File | null>(null);
  const [duplicate, setDuplicate] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,20}$/;

  const handleBlur = (field: string) => {
    let error = "";

    if (field === "email") {
      if (!emailRegEx.test(email)) {
        error = "이메일 형식이 올바르지 않습니다.";
      }
    } else if (field === "password") {
      if (password.match(passwordRegEx) === null) {
        error = "비밀번호 형식이 올바르지 않습니다.";
      }
    } else if (field === "passwordCheck") {
      if (password !== passwordChk) {
        error = "비밀번호가 일치하지 않습니다.";
      }
    } /* else if (field === "nickname") {
      error = "이미 사용중인 닉네임 입니다";
    } */

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };
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

  const emailCheck = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/duplication/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (response.ok) {
        const provider = await response.json();

        if (provider) {
          // 중복된 이메일이 있는 경우
          setProvider(provider);
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: `${provider}로 가입된 이메일입니다.`,
          }));
        } else {
          // 중복된 이메일이 없는 경우
          setProvider(null);
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "",
          }));
          setDuplicate("사용가능한 이메일 입니다.");
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "이메일 확인 중 오류가 발생했습니다.",
        }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "이메일 확인 중 오류가 발생했습니다.",
      }));
    }
  };
  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //프로필 이미지 등록한 경우
    if (!email || errors.email) {
      alert("이메일을 확인해주세요,");
      return;
    }
    if (!password || errors.password || !passwordChk || errors.passwordCheck) {
      alert("비밀번호를 확인해주세요.");
      return;
    }
    if (!nickname) {
      alert("닉네임을 확인해주세요.");
      return;
    }
    setUploading(true);

    if (previewImg) {
      const imageUrl = await saveHandler();

      if (!imageUrl) {
        alert("이미지 업로드에 실패했습니다.");
        return;
      }
      try {
        // 이미지 파일이 선택된 경우에만 업로드 수행

        const response = await fetch(`/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nickname,
            nickname,
            email,
            password,
            image: imageUrl,
          }), // 이미지 URL을 API에 전달
        });

        if (response.ok) {
          alert("회원가입이 완료되었습니다!");
          router.replace("/");
          router.refresh();
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("회원가입중 오류가 발생했습니다.");
      } finally {
        setUploading(false);
      }
    } else {
      try {
        const response = await fetch(`/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nickname,
            nickname,
            email,
            password,
            image: null,
          }),
        });

        if (response.ok) {
          alert("회원가입이 완료되었습니다!");
          router.replace("/");
          router.refresh();
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("회원가입중 오류가 발생했습니다.");
      } finally {
        setUploading(false);
      }
    }
  };

  const imgRef = useRef<any>(null);

  const onClickFileBtn = (e: any) => {
    imgRef.current.click();
  };

  return (
    <div className={styles.editContainer}>
      <form className={styles.editContent} onSubmit={onRegister}>
        <h2>회원가입</h2>
        <hr />
        <div className={styles.photoBlock}>
          {previewImg ? (
            <img
              src={URL.createObjectURL(previewImg)}
              className={styles.editPhoto}
              onClick={onClickFileBtn}
            />
          ) : (
            <img
              src={previewImg ? previewImg : "/avatar.png"}
              className={styles.editPhoto}
              onClick={onClickFileBtn}
            />
          )}
          {previewImg && <span onClick={removeImage}>이미지 삭제</span>}
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
          <label className={styles.editLabel}>이메일</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={() => handleBlur("email")}
            className={cx(
              errors.email ? styles.errorInput : styles.contentInput
            )}
          />
          {errors.email && (
            <span className={styles.errorSpan}>{errors.email}</span>
          )}
          {duplicate && !errors.email && (
            <span className={styles.okSpan}>{duplicate}</span>
          )}
          <button
            className={styles.checkBtn}
            onClick={emailCheck}
            disabled={errors.email !== "" || email === ""}
          >
            이메일 중복확인
          </button>
        </div>

        <div className={styles.contentBlock}>
          <label className={styles.editLabel}>비밀번호</label>
          <div className={styles.passInfo}>
            영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            className={cx(
              errors.password ? styles.errorInput : styles.contentInput
            )}
          />
          {errors.password && (
            <span className={styles.errorSpan}>{errors.password}</span>
          )}
        </div>
        <div className={styles.contentBlock}>
          <label className={styles.editLabel}>비밀번호확인</label>
          <input
            type="password"
            value={passwordChk}
            onChange={(e) => setPasswordChk(e.target.value)}
            onBlur={() => handleBlur("passwordCheck")}
            className={cx(
              errors.passwordCheck ? styles.errorInput : styles.contentInput
            )}
          />
          {errors.passwordCheck && (
            <span className={styles.errorSpan}>{errors.passwordCheck}</span>
          )}
        </div>
        <div className={styles.contentBlock}>
          <label className={styles.editLabel}>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => handleBlur("nickname")}
            className={cx(
              errors.nickname ? styles.errorInput : styles.contentInput
            )}
          />
          {/*  {errors.nickname && (
            <span className={styles.errorSpan}>{errors.nickname}</span>
          )} */}
        </div>
        <hr />
        <button type="submit" className={styles.submitBtn}>
          회원가입
        </button>
      </form>
      {uploading && (
        <div className={styles.loadingOverlay}>
          <span>회원가입중</span>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
