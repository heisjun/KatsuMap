export async function getStoreInfo({ queryKey }: any) {
  const [_1, _2, user_email] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/store/list?user_email=${user_email}`,
    {
      next: {
        tags: ["store", "info"],
      },
      cache: "no-store",
    }
  );
  if (!res) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
