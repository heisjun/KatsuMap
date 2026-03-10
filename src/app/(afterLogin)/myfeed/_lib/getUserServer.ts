import { fetchClient } from "@/app/_lib/fetchClient";

export const getUserServer = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [_1, userId] = queryKey;
  if (!userId) return null;
  
  return fetchClient<any>(`/api/mypage/${userId}/username`, {
    next: {
      tags: ["mypage", userId],
      revalidate: 300,
    },
  });
};
