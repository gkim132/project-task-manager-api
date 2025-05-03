import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({ region: "us-east-1" });

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimetype: string
): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 Bucket name is not configured");
  }

  const key = `${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: "public-read"
  });

  await s3.send(command);

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};
