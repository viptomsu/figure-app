import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImageToCloudinary = async (
	fileBuffer: Buffer,
	fileName: string,
	compress: boolean = false,
	contentType?: string,
	folder: string = "figure/general"
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const publicId = `${uuidv4()}-${fileName}`;

		// Configure transformations based on compress parameter
		const transformations = compress
			? [{ width: 800, quality: "auto", fetch_format: "auto" }]
			: [{ quality: "auto", fetch_format: "auto" }];

		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "image",
				folder: folder,
				public_id: publicId,
				format: contentType?.split("/")[1] || "jpg",
				transformation: transformations,
			},
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				if (!result) {
					reject(new Error("Upload failed"));
					return;
				}

				resolve(result.secure_url);
			}
		);

		uploadStream.end(fileBuffer);
	});
};

export const uploadFileToCloudinary = async (
	fileBuffer: Buffer,
	fileName: string,
	folder: string = "figure/general"
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const publicId = `${uuidv4()}-${fileName}`;

		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "auto",
				folder: folder,
				public_id: publicId,
			},
			(error, result) => {
				if (error) {
					reject(error);
					return;
				}

				if (!result) {
					reject(new Error("Upload failed"));
					return;
				}

				resolve(result.secure_url);
			}
		);

		uploadStream.end(fileBuffer);
	});
};
