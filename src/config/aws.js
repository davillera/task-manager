const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadImageToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`, // El nombre de la imagen en S3
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Para que la imagen sea accesible públicamente
  };

  const data = await s3.upload(params).promise();
  return data.Location; // Retorna la URL de la imagen subida
};
