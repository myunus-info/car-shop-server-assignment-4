import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import multer from 'multer';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// export const sendImageToCloudinary = async (
//   imageName: string,
//   path: string,
// ): Promise<UploadApiResponse> => {
//   try {
//     const result = await cloudinary.uploader.upload(path, {
//       public_id: imageName.trim(),
//       folder: 'students',
//     });
//     await fs.unlink(path);
//     return result;
//   } catch (error) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload image to Cloudinary');
//   }
// };
export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: imageName.trim(),
      folder: 'students',
    });
    return result;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Image upload failed');
  } finally {
    await fs.unlink(path).catch(() => {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete local file');
    });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/uploads/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

export const upload = multer({ storage });
