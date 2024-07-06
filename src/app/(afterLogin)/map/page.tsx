import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";
import MarkerList from "./_component/MarkerList";
import { auth } from "@/auth";

export default async function MainMap() {
  const session = await auth();
  const user_email = session?.user?.email as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", "info", user_email, { order: "popular" }],
    queryFn: getStoreInfo,
  });
  const dehydratedState = dehydrate(queryClient);
  //서버에서 온 데이터를 클라이언트에서 그대로 물려받는걸 디하이드레이트라고 칭함

  //queryClient.getQueryData(  ['store','info']); 데이터 가져오는 방법.
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <MarkerList />
      </HydrationBoundary>
    </>
  );
}
