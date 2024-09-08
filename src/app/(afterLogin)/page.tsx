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
  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <KatsuList searchParams={searchParams} />
      </HydrationBoundary>
    </>
  );
}
