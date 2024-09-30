import { createUploadthing, type FileRouter } from "uploadthing/next";
import Compressor from "compressorjs";

const f = createUploadthing();

// Function to compress image before upload
export const compressFile = (file: File) => {
	return new Promise<File>((resolve, reject) => {
		if (!file) {
			reject();
			return;
		}

		new Compressor(file, {
			quality: 0.6,
			maxWidth: 1000,
			success: (compressed) => {
				resolve(compressed as File);
			},
			error: (err) => {
				reject(err);
			},
		});
	});
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: "4MB" } })
		// Set permissions and file types for this FileRoute
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete");

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return;
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
