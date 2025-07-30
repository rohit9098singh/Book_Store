import multer from "multer";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface CustomFile extends Express.Multer.File {
  buffer: Buffer;
}

const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image", 
  };

  return new Promise((resolve, reject) => {
    // Convert buffer to base64 string for Cloudinary
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    
    cloudinary.uploader.upload(dataURI, options, (error, result) => {
      if (error) return reject(error);
      resolve(result as UploadApiResponse);
    });
  });
};

// Use memory storage instead of disk storage for Vercel
const multerMiddleware = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
}).array("images", 4);

export { uploadToCloudinary, multerMiddleware };
