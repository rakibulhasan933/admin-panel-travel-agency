import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "64MB", maxFileCount: 1 } }).onUploadComplete(async ({ metadata, file }) => {
        return { uploadedBy: "admin", url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
