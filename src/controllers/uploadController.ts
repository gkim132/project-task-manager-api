import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { uploadToS3 } from "../utils/uploadToS3";
import { File } from "multer";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import BaseError from "../utils/baseError";

interface IFileRequest extends Request {
  file: File;
}

export const uploadImage = catchAsync(
  async (req: IFileRequest, res: Response) => {
    if (!req.file) {
      throw new BaseError("No file uploaded", 400);
    }

    const file = req.file;
    const result = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    res.status(200).json({
      message: "File uploaded successfully",
      data: result
    });
  }
);

export const getPresignedUrl = catchAsync(
  async (req: IFileRequest, res: Response) => {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      throw new BaseError("fileName and contentType are required", 400);
    }

    const { uploadUrl, imageUrl } = await generatePresignedUrl(
      fileName,
      contentType
    );

    res.status(200).json({
      uploadUrl,
      imageUrl
    });
  }
);
