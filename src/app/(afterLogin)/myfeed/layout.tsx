import { ReactNode } from "react";
import FeedTab from "./_component/FeedTab";

type Props = { children: ReactNode };
export default function MypageLayout({ children }: Props) {
  return (
    <div>
      <FeedTab />
      <main>{children}</main>
    </div>
  );
}
