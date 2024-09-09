import { Metadata } from "next";
import TypeTest from "./_component/TypeTest";

export const metadata: Metadata = {
  title: "돈비티아이 / KatsuMap",
  description: "당신의 돈까스 취향을 찾아보세요",
};

export default function RegisterPage() {
  return (
    <div>
      <TypeTest />
    </div>
  );
}
