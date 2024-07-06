import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import KatsuList from "@/app/(afterLogin)/_component/KatsuList";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import { auth } from "@/auth";

type Props = {
  searchParams: { order: string };
};

export default async function Main({ searchParams }: Props) {
  const session = await auth();
  const user_email = session?.user?.email as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", "info", user_email, searchParams],
    queryFn: getStoreInfo,
  });

  const dehydratedState = dehydrate(queryClient);
  //서버에서 온 데이터를 클라이언트에서 그대로 물려받는걸 디하이드레이트라고 칭함

  //queryClient.getQueryData(  ['store','info']); 데이터 가져오는 방법.
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <KatsuList searchParams={searchParams} />
      </HydrationBoundary>
    </>
  );
}
