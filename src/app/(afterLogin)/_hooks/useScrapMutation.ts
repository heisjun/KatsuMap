import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";

interface ScrapMutationProps {
  postId: string;
  user_email: string | null | undefined;
  scrapId: string;
}

export function useScrapMutation({ postId, user_email, scrapId }: ScrapMutationProps) {
  const queryClient = useQueryClient();

  // 스크랩 추가 Mutation
  const scrapMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/${postId}/scrap`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ scrapId, user_email, postId }),
        }
      );
      if (!res.ok) throw new Error("Scrap failed");
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["store"] });

      const previousStores = queryClient.getQueriesData<any>({
        queryKey: ["store"],
      });

      queryClient.setQueriesData<any>(
        { queryKey: ["store"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          // [1] Infinite Query 캐시 (KatsuList 등)
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: IKatsuInfo[]) =>
                page.map((store) =>
                  store.post_id === postId ? { ...store, is_scrap: 1 } : store
                )
              ),
            };
          } 
          // [2] 일반 배열 캐시 (MarkerList 등)
          else if (Array.isArray(oldData)) {
            return oldData.map((store: IKatsuInfo) =>
              store.post_id === postId ? { ...store, is_scrap: 1 } : store
            );
          } 
          // [3] 단일 상세보기 캐시 (상세 페이지 등)
          else {
            if (oldData.post_id === postId) {
              return { ...oldData, is_scrap: 1 };
            }
            return oldData;
          }
        }
      );

      return { previousStores };
    },
    onError: (err, variables, context) => {
      console.error(err);
      alert("오류가 발생했습니다!");
      if (context?.previousStores) {
        context.previousStores.forEach(([queryKey, oldData]: [unknown, any]) => {
          queryClient.setQueryData(queryKey as any, oldData);
        });
      }
    },
  });

  // 스크랩 취소 Mutation
  const unscrapMutation = useMutation({
    mutationFn: async (unScrapId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/${postId}/scrap`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ unScrapId }),
        }
      );
      if (!res.ok) throw new Error("Unscrap failed");
      if (res.status === 204) return null; // 204 No Content 방어 코드
      return res.json().catch(() => null); // 빈 Body 파싱 에러 방어
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["store"] });

      const previousStores = queryClient.getQueriesData<any>({
        queryKey: ["store"],
      });

      queryClient.setQueriesData<any>(
        { queryKey: ["store"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          // [1] Infinite Query 캐시
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: IKatsuInfo[]) =>
                page.map((store) =>
                  store.post_id === postId ? { ...store, is_scrap: 0 } : store
                )
              ),
            };
          } 
          // [2] 일반 배열 캐시
          else if (Array.isArray(oldData)) {
            return oldData.map((store: IKatsuInfo) =>
              store.post_id === postId ? { ...store, is_scrap: 0 } : store
            );
          } 
          // [3] 단일 상세보기 캐시
          else {
            if (oldData.post_id === postId) {
              return { ...oldData, is_scrap: 0 };
            }
            return oldData;
          }
        }
      );

      return { previousStores };
    },
    onError: (err, variables, context) => {
      console.error(err);
      alert("오류가 발생했습니다!");
      if (context?.previousStores) {
        context.previousStores.forEach(([queryKey, oldData]: [unknown, any]) => {
          queryClient.setQueryData(queryKey as any, oldData);
        });
      }
    },
  });

  return { scrapMutation, unscrapMutation };
}
