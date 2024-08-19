import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSearchList } from "./_lib/getSearchList";
import SearchList from "./_component/SearchList";
import { auth } from "@/auth";
import { Metadata } from "next";

type Props = {
  searchParams: { query: string; order: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: `${searchParams.query} - 검색 / KatsuMap`,
    description: `${searchParams.query} - 검색 / KatsuMap`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const session = await auth();
  const user_email = session?.user?.email as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["store", "search", user_email, searchParams],
    queryFn: getSearchList,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <SearchList searchParams={searchParams} />
      </HydrationBoundary>
    </>
  );
}
