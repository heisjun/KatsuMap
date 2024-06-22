import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getScrapList } from "./_lib/getScrapList";
import ScrapList from "./_component/ScrapList";

interface Props {
  params: { userId: string };
}

export default async function StoreInfo({ params }: Props) {
  const { userId } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["mypage", "scrap", userId],
    queryFn: getScrapList,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <ScrapList userId={userId} />
      </HydrationBoundary>
    </>
  );
}
