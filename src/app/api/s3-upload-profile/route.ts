import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// 이미지 저장
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("img") as File | null; // 단일 파일 가져오기

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const Body = (await file.arrayBuffer()) as Buffer;
    const Key = `${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body,
        ContentType: file.type,
      })
    );

    const url = `https://d36dcj71lapw9d.cloudfront.net/${Key}`;

    return new Response(JSON.stringify({ message: "OK", url }), {
      // urls에서 url로 변경
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ error: "Error uploading file" }), {
      status: 500,
    });
  }
}
