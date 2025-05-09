import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: "us-east-1" });

export const generatePresignedUrl = async (
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; imageUrl: string }> => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 bucket name not configured");
  }

  const key = `${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    ACL: "public-read"
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 30 });

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

  return { uploadUrl, imageUrl };
};
