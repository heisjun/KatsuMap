import { Metadata } from "next";
import RegisterForm from "./_component/RegisterForm";

export const metadata: Metadata = {
  title: "회원가입 / KatsuMap",
  description: "회원가입",
};

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
