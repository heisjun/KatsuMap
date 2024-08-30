import { getUserServer } from "./_lib/getUserServer";
import { auth } from "@/auth";
import { IUser } from "@/model/User";
import EditForm from "./_component/EditForm";

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

export default async function UserInfo() {
  const session = await auth();
  const userId = session?.user?.email as string;
  const user: IUser = await getUserServer({
    queryKey: ["mypage", userId],
  });

  return <EditForm user={user} />;
}
