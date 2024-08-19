import KatsuDetail from "./_component/katsuDetail";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getSingleKatsuInfo } from "./_lib/getSingleKatsuInfo";
import { getStoreServer } from "./_lib/getStoreServer";
import { IStore } from "@/model/Store";

interface Props {
  params: { postId: string };
}

export async function generateMetadata({ params }: Props) {
  const store: IStore = await getStoreServer({
    queryKey: ["store", params.postId],
  });
  return {
    title: `${store.name} / KatsuMap`,
    description: `${store.title}`,
  };
}

export default async function StoreInfo({ params }: Props) {
  const { postId } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", postId],
    queryFn: getSingleKatsuInfo,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <KatsuDetail postId={postId} />
      </HydrationBoundary>
    </>
  );
}
