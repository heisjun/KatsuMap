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
    icons: {
      icon: "/logoIcon.png",
    },
    openGraph: {
      title: `${store.name} / KatsuMap`,
      description: `${store.title} 상세보기`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.postId}`,
      images: [
        {
          url: `${store.image_url}`, // 썸네일 이미지 URL
          alt: `${store.name} Thumbnail`, // 이미지 대체 텍스트
        },
      ],
      siteName: "KatsuMap", // 사이트 이름
    },
  };
}

export default async function StoreInfo({ params }: Props) {
  console.log("링크:", `${process.env.NEXT_PUBLIC_BASE_URL}/${params.postId}`);
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
