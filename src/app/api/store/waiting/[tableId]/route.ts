import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { tableId: string } }
) {
  noStore();
  try {
    const response = await fetch(
      `https://ct-api.catchtable.co.kr/reservation-api/v1/waiting-shops/${params.tableId}?withWaitingsStatus=true`
    );
    if (response.ok) {
      const res = await response.json();
      return NextResponse.json(res.data.tableStatus);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
