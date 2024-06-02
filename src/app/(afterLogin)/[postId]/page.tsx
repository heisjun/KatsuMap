import KatsuDetail from "./_component/katsuDetail";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getSingleKatsuInfo } from "./_lib/getSingleKatsuInfo";

interface Props {
  params: { postId: string };
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
