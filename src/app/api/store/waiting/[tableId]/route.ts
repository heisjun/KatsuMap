import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";
import https from "https";

export async function GET(
  request: Request,
  { params }: { params: { tableId: string } },
) {
  noStore();

  const url = `https://ct-api.catchtable.co.kr/reservation-api/v1/waiting-shops/${params.tableId}?withTable=true&withWaitingsStatus=true&withPersonOption=false`;

  try {
    const data = await new Promise((resolve, reject) => {
      https
        .get(
          url,
          {
            headers: {
              "User-Agent": "PostmanRuntime/7.39.0",
              Accept: "*/*",
              Connection: "keep-alive",
            },
          },
          (res) => {
            if (res.statusCode !== 200) {
              reject(
                new Error(`CatchTable API returned status: ${res.statusCode}`),
              );
              return;
            }
            let body = "";
            res.on("data", (chunk) => {
              body += chunk;
            });
            res.on("end", () => {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(new Error("Failed to parse CatchTable JSON"));
              }
            });
          },
        )
        .on("error", (e) => reject(e));
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("CatchTable API Error (via https module):", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
