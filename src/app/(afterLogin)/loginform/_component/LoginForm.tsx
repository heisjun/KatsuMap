"use client";

import style from "./loginForm.module.css";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await signIn("credentials", {
        email: id,
        password,
        redirect: false,
      });
      if (response?.error) {
        setMessage("아이디와 비밀번호가 일치하지 않습니다.");
      } else {
        window.location.href = "/";
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setMessage("아이디와 비밀번호가 일치하지 않습니다.");
    }
  };
  const onClickClose = () => {
    router.back();
  };

  const goToRegister = () => {
    window.location.href = "/register";
  };

  const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setId(e.target.value);
  };

  const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <button className={style.closeButton} onClick={onClickClose}>
            <svg
              width={24}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
            >
              <g>
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
              </g>
            </svg>
          </button>
          <img className={style.logo} src="Logo.png" />
        </div>
        <form onSubmit={onSubmit}>
          <div className={style.modalBody}>
            <div className={style.inputDiv}>
              <input
                id="id"
                className={style.inputId}
                value={id}
                onChange={onChangeId}
                type="text"
                placeholder="이메일"
              />
            </div>
            <div className={style.inputDiv}>
              <input
                id="password"
                className={style.inputPw}
                value={password}
                autoComplete="off"
                onChange={onChangePassword}
                type="password"
                placeholder="비밀번호"
              />
            </div>
          </div>
          <div className={style.message}>{message}</div>
          <div className={style.modalFooter}>
            <button
              type="submit"
              className={style.actionButton}
              disabled={!id || !password}
            >
              로그인
            </button>
          </div>
          <div className={style.signInBlock} onClick={goToRegister}>
            <span>회원가입</span>
          </div>
        </form>
        <div className={style.oAuthContainer}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => signIn("kakao", { callbackUrl: "/" })}
          >
            <g fill="none">
              <path
                fill="#FFEB00"
                d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24z"
              ></path>
              <path
                fill="#3C2929"
                d="M24 11.277c8.284 0 15 5.306 15 11.85 0 6.545-6.716 11.85-15 11.85-.92 0-1.822-.066-2.697-.191l-6.081 4.105a.43.43 0 0 1-.674-.476l1.414-5.282C11.777 31.031 9 27.335 9 23.127c0-6.544 6.716-11.85 15-11.85zm6.22 8.407c-.416 0-.718.297-.718.707v5.939c0 .41.289.686.718.686.41 0 .718-.295.718-.686v-1.932l.515-.526 1.885 2.57c.277.374.426.54.691.568.037.003.075.005.112.005.154 0 .66-.04.716-.563.038-.293-.137-.52-.348-.796l-2.043-2.675 1.727-1.743.176-.196c.234-.26.353-.39.353-.587.009-.422-.34-.652-.687-.661-.274 0-.457.15-.57.262l-2.528 2.634v-2.3c0-.422-.288-.706-.717-.706zm-9.364 0c-.56 0-.918.432-1.067.837l-2.083 5.517a.84.84 0 0 0-.065.315c0 .372.31.663.706.663.359 0 .578-.162.69-.51l.321-.97h2.999l.313.982c.111.335.34.498.7.498.367 0 .655-.273.655-.62 0-.056-.017-.196-.081-.369l-2.019-5.508c-.187-.53-.577-.835-1.069-.835zm-2.92.064h-4.452c-.417 0-.642.337-.642.654 0 .3.168.652.642.652h1.51v5.21c0 .464.274.752.716.752.443 0 .718-.288.718-.751v-5.21h1.508c.474 0 .643-.352.643-.653 0-.317-.225-.654-.643-.654zm7.554-.064c-.442 0-.717.287-.717.75v5.707c0 .497.28.794.75.794h2.674c.434 0 .677-.321.686-.627a.642.642 0 0 0-.17-.479c-.122-.13-.3-.2-.516-.2h-1.99v-5.195c0-.463-.274-.75-.717-.75zm-4.628 1.306l.008.01 1.083 3.265h-2.192L20.842 21a.015.015 0 0 1 .028 0z"
              ></path>
            </g>
          </svg>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => signIn("naver", { callbackUrl: "/" })}
          >
            <g fill="none">
              <path
                fill="#00C63B"
                d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24z"
              ></path>
              <path
                fill="#FFF"
                d="M21 25.231V34h-7V15h7l6 8.769V15h7v19h-7l-6-8.769z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
