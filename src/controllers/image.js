const Image = require("../models/image"); // Asegúrate de que la ruta es correcta
const { uploadFile, deleteFile } = require("../config/aws");

exports.uploadImage = async (req, res) => {
  try {
    console.log("req.body: ", req.body); // Verifica qué hay en el cuerpo de la solicitud
    console.log("req.file:", req.file);

    const file = req.file;

    console.log("File received: ", file);

    if (!file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    // Subir archivo a S3 y obtener la URL
    const fileUrl = await uploadFile(file);

    // Guardar la URL en la base de datos
    const image = await Image.create({
      url: fileUrl,
      taskId: req.body.taskId, // Asegúrate de que taskId está en el cuerpo de la solicitud
    });

    res.status(201).json({ message: "File uploaded and URL saved successfully", image });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar la imagen en la base de datos
    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // 2. Eliminar el archivo de S3
    try {
      await deleteFile(image.url);
    } catch (err) {
      console.error("Error deleting file from S3:", err);
      return res.status(500).json({ message: "Failed to delete file from S3" });
    }

    // 3. Eliminar la entrada en la base de datos
    await image.destroy();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};
