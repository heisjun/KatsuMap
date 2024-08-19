import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getScrapList } from "../_lib/getScrapList";
import ScrapList from "../_component/ScrapList";
import { auth } from "@/auth";

export default async function bookMarkPage() {
  const session = await auth();
  const userId = session?.user?.email as string;
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
