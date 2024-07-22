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
    const files = formData.getAll("img") as File[];

    const uploadPromises = files.map(async (file, index) => {
      const Body = (await files[index].arrayBuffer()) as Buffer;
      const Key = `${file.name}`;
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
          ContentType: file.type,
        })
      );
      return `https://d36dcj71lapw9d.cloudfront.net/${Key}`;
    });

    const urls = await Promise.all(uploadPromises);

    return new Response(JSON.stringify({ message: "OK", urls }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return new Response(JSON.stringify({ error: "Error uploading files" }), {
      status: 500,
    });
  }
}
