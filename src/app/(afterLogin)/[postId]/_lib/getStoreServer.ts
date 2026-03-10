import { fetchClient } from "@/app/_lib/fetchClient";
import { IStore } from "@/model/Store";

export const getStoreServer = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [_1, postId] = queryKey;
  return fetchClient<IStore>(`/api/store/${postId}/meta`, {
    next: {
      tags: ["store", postId],
      revalidate: 60,
    },
  });
};
