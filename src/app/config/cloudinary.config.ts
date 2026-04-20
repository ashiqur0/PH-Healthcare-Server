import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
});

export const cloudinaryUpload = cloudinary;

export const deleteFileFromCloudinary = async (url: string) => {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
        try {
            const publicId = match[1];
            await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
            
            console.log(`file ${publicId} deleted from cloudinary`);
        } catch (error) {
            console.log("Error deleting file from cloudinary", error);

            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
        }

    }
}