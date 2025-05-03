import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { getPresignedUrl, uploadImage } from "../controllers/uploadController";
import multer from "multer";

const router = express.Router();

const upload = multer();

router
  .route("/upload")
  .post(authenticateUser, upload.single("file"), uploadImage);

router.route("/presign").post(authenticateUser, getPresignedUrl);

export default router;
