import { getUserServer } from "./_lib/getUserServer";
import { auth } from "@/auth";
import { IUser } from "@/model/User";

interface Props {
  params: { postId: string };
}

export async function generateMetadata({ params }: Props) {
  const session = await auth();
  const userId = session?.user?.email as string;
  const user: IUser = await getUserServer({
    queryKey: ["mypage", userId],
  });
  return {
    title: `${user.name} / KatsuMap`,
    description: `${user.name} 프로필`,
  };
}
export default async function StoreInfo() {
  return (
    <div>
      <div>사진</div>
      <div></div>
    </div>
  );
}
