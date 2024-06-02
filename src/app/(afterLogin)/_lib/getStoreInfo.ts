export async function getStoreInfo() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getStoreList`,
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
