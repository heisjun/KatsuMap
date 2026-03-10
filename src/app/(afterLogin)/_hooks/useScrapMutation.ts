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
      // 1. 진행 중인 쿼리가 있으면 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({ queryKey: ["store"] });

      // 2. 롤백을 위한 이전 쿼리들 스냅샷 저장 (어떤 쿼리키의 데이터가 어떻게 있었는지)
      const previousStores = queryClient.getQueriesData<IKatsuInfo | IKatsuInfo[]>({
        queryKey: ["store"],
      });

      // 3. 낙관적 업데이트 수행: 조건(store로 시작하는 모든 캐시)을 만족하는 모든 쿼리를 순회하며 업데이트
      queryClient.setQueriesData<IKatsuInfo | IKatsuInfo[]>(
        { queryKey: ["store"] },
        (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            // [1] 리스트형 캐시 업데이트
            return oldData.map((store) =>
              store.post_id === postId ? { ...store, is_scrap: 1 } : store
            );
          } else {
            // [2] 단일 상세보기 캐시 업데이트
            if (oldData.post_id === postId) {
              return { ...oldData, is_scrap: 1 };
            }
            return oldData;
          }
        }
      );

      // Context에 이전 스냅샷 반환
      return { previousStores };
    },
    // 에러 발생 시 onMutate에서 반환된 컨텍스트(스냅샷)를 통해 롤백 수행
    onError: (err, variables, context) => {
      alert("오류가 발생했습니다!");
      if (context?.previousStores) {
        context.previousStores.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
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
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["store"] });

      const previousStores = queryClient.getQueriesData<IKatsuInfo | IKatsuInfo[]>({
        queryKey: ["store"],
      });

      queryClient.setQueriesData<IKatsuInfo | IKatsuInfo[]>(
        { queryKey: ["store"] },
        (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((store) =>
              store.post_id === postId ? { ...store, is_scrap: 0 } : store
            );
          } else {
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
      alert("오류가 발생했습니다!");
      if (context?.previousStores) {
        context.previousStores.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
  });

  return { scrapMutation, unscrapMutation };
}
