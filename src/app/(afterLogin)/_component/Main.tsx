import styles from "@/app/(afterLogin)/_component/main.module.css";
import KatsuInfo from "./KatsuInfo";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import KatsuList from "@/app/(afterLogin)/_component/KatsuList";
import { getStoreInfo } from "@/app/(afterLogin)/_lib/getStoreInfo";

export default async function Main() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", "info"],
    queryFn: getStoreInfo,
  });
  const dehydratedState = dehydrate(queryClient);
  //서버에서 온 데이터를 클라이언트에서 그대로 물려받는걸 디하이드레이트라고 칭함

  //queryClient.getQueryData(  ['store','info']); 데이터 가져오는 방법.
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <KatsuList />
      </HydrationBoundary>
    </>
  );
}
