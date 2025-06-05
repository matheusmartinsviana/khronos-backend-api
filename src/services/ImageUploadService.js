const cloudinary = require("../config/cloudinary")
const AppError = require("../errors/AppError")

class ImageUploadService {
    async uploadImage(file, options = {}) {
        try {
            const uploadOptions = {
                folder: "products", // Pasta no Cloudinary
                resource_type: "image",
                transformation: [
                    { width: 800, height: 800, crop: "limit" }, // Redimensionar se maior que 800x800
                    { quality: "auto" }, // Qualidade automática
                    { format: "auto" }, // Formato automático (WebP quando suportado)
                ],
                ...options,
            }

            // Verificar se é buffer (memoryStorage) ou caminho de arquivo
            let uploadSource

            if (file.buffer) {
                // Se é buffer (memoryStorage), converter para base64
                const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
                uploadSource = base64String
            } else if (file.path) {
                // Se é caminho de arquivo (diskStorage)
                uploadSource = file.path
            } else {
                throw new Error("Invalid file format")
            }

            const result = await cloudinary.uploader.upload(uploadSource, uploadOptions)

            return {
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
            }
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error)
            throw new AppError("Failed to upload image. Please try again.", 500)
        }
    }

    async deleteImage(publicId) {
        try {
            if (!publicId) return

            const result = await cloudinary.uploader.destroy(publicId)
            console.log("Image deleted from Cloudinary:", result)
            return result
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error)
            // Não lançar erro para não quebrar o fluxo principal
        }
    }

    async uploadMultipleImages(files, options = {}) {
        try {
            const uploadPromises = files.map((file) => this.uploadImage(file, options))
            const results = await Promise.all(uploadPromises)
            return results
        } catch (error) {
            console.error("Error uploading multiple images:", error)
            throw new AppError("Failed to upload one or more images. Please try again.", 500)
        }
    }

    // Gerar URLs com transformações específicas
    generateImageUrl(publicId, transformations = {}) {
        try {
            return cloudinary.url(publicId, {
                secure: true,
                ...transformations,
            })
        } catch (error) {
            console.error("Error generating image URL:", error)
            return null
        }
    }

    // Gerar thumbnail
    generateThumbnail(publicId, width = 200, height = 200) {
        return this.generateImageUrl(publicId, {
            width,
            height,
            crop: "fill",
            gravity: "center",
            quality: "auto",
            format: "auto",
        })
    }

    // Upload direto via stream (alternativa para buffers grandes)
    async uploadImageStream(file, options = {}) {
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                folder: "products",
                resource_type: "image",
                transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
                ...options,
            }

            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) {
                    console.error("Error uploading image stream to Cloudinary:", error)
                    reject(new AppError("Failed to upload image. Please try again.", 500))
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes,
                    })
                }
            })

            // Enviar o buffer para o stream
            uploadStream.end(file.buffer)
        })
    }
}

module.exports = new ImageUploadService()
