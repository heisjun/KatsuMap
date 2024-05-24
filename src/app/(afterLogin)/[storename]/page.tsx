import styles from "@/app/(afterLogin)/[storename]/storeInfo.module.css";
import KatsuDetail from "./_component/katsuDetail";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getStoreInfo } from "../_lib/getStoreInfo";
import { getSingleKatsuInfo } from "./_lib/getSingleKatsuInfo";

interface Props {
  params: { storename: string };
}

export default async function StoreInfo({ params }: Props) {
  const { storename } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", storename],
    queryFn: getSingleKatsuInfo,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <KatsuDetail storename={storename} />
      </HydrationBoundary>
    </>
  );
}
