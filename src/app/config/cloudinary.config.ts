import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envVars } from './env';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
});

export const cloudinaryUpload = cloudinary;

export const uploadFileToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse> => {
    if (!buffer || !fileName) {
        throw new AppError(status.BAD_REQUEST, "file or file name is required to upload");
    }

    const extension = fileName.split('.').pop()?.toLowerCase();

    const fileNameWithoutExtension = fileName
        .split('.')
        .slice(0, -1)
        .join('.')
        .toLowerCase()
        .replace(/\s+/g, '-')
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-]/g, '');

    const uniqueName = Math.random().toString(36).substring(2) +
        '-' +
        Date.now() +
        '-' +
        fileNameWithoutExtension;

    const folder = extension === 'pdf' ? 'pdfs' : 'images';

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                public_id: `ph-health-care/${folder}/${uniqueName}`,
                folder: `ph-health-care/${folder}`,
            },
            (error, result) => {
                if (error) {
                    reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
                } else {
                    resolve(result as UploadApiResponse);
                }
            }
        ).end(buffer);
    });
};

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