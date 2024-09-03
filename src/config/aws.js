const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

if (!process.env.AWS_BUCKET_REGION || !process.env.AWS_PUBLIC_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_BUCKET_NAME) {
  throw new Error("Missing required environment variables for AWS configuration");
}

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function uploadFile(file) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`, 
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  console.log("Upload Params: ", uploadParams);

  try {
    const command = new PutObjectCommand(uploadParams);
    const result = await s3.send(command);

    console.log("File uploaded successfully:", result);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${uploadParams.Key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
}

async function deleteFile(fileUrl) {
  const fileName = fileUrl.split("/").pop();

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("File deletion failed");
  }
}

module.exports = { uploadFile, deleteFile };