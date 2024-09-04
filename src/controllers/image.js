const Image = require("../models/image");
const { uploadFile, deleteFile } = require("../config/aws");

exports.uploadImage = async (req, res) => {
  try {
    console.log("req.body: ", req.body);
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
      taskId: req.body.taskId,
    });

    res
      .status(201)
      .json({ message: "File uploaded and URL saved successfully", image });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    try {
      await deleteFile(image.url);
    } catch (err) {
      console.error("Error deleting file from S3:", err);
      return res.status(500).json({ message: "Failed to delete file from S3" });
    }

    await image.destroy();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

exports.getImages = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (taskId) {
      const images = await Image.findAll({ where: { taskId } });
      
      if (images.length === 0) {
        return res.status(404).json({ message: "No images found for this task" });
      }
      
      return res.status(200).json(images);
    } else {
      return res.status(400).json({ message: "Task ID is required" });
    }
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    // Buscar la imagen existente en la base de datos
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Eliminar la imagen anterior de S3
    try {
      await deleteFile(image.url);
    } catch (err) {
      console.error("Error deleting old file from S3:", err);
      return res.status(500).json({ message: "Failed to delete old file from S3" });
    }

    // Subir el nuevo archivo a S3 y obtener la nueva URL
    const fileUrl = await uploadFile(file);

    // Actualizar la entrada en la base de datos con la nueva URL
    image.url = fileUrl;
    await image.save();

    res.status(200).json({ message: "Image updated successfully", image });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ error: "Failed to update image" });
  }
};

