const ProductController = require("../controllers/ProductController")
const ImageUploadService = require("../services/ImageUploadService")
const multer = require("multer")

// Configuração do multer para upload em memória (não salvar no disco)
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // Aceitar apenas imagens
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
})

class ProductApi {
    async createProduct(req, res) {
        const { name, code, price, description, zoning, product_type, observation, segment } = req.body

        try {
            let imageUrl = null
            let imagePublicId = null

            // Se há arquivo de imagem, fazer upload para Cloudinary
            if (req.file) {
                console.log("File received:", {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    hasBuffer: !!req.file.buffer,
                    bufferLength: req.file.buffer ? req.file.buffer.length : 0,
                })

                const uploadResult = await ImageUploadService.uploadImage(req.file, {
                    folder: "products",
                    public_id: `product_${Date.now()}`, // ID único para o produto
                })

                imageUrl = uploadResult.url
                imagePublicId = uploadResult.public_id

                console.log("Upload successful:", { imageUrl, imagePublicId })
            }

            const product = await ProductController.create(
                name,
                code,
                price,
                description,
                zoning,
                product_type,
                observation,
                segment,
                imageUrl,
                imagePublicId,
            )

            return res.status(201).send(product)
        } catch (e) {
            console.error("Error in createProduct:", e)
            return res.status(400).send({ error: e.message })
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params
        const { name, code, price, description, zoning, product_type, observation, segment } = req.body

        try {
            let imageUrl = undefined
            let imagePublicId = undefined

            // Se há arquivo de imagem, fazer upload para Cloudinary
            if (req.file) {
                console.log("File received for update:", {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    hasBuffer: !!req.file.buffer,
                })

                // Buscar produto atual para deletar imagem antiga
                const currentProduct = await ProductController.findProduct(id)

                const uploadResult = await ImageUploadService.uploadImage(req.file, {
                    folder: "products",
                    public_id: `product_${id}_${Date.now()}`,
                })

                imageUrl = uploadResult.url
                imagePublicId = uploadResult.public_id

                // Deletar imagem antiga do Cloudinary
                if (currentProduct.image_public_id) {
                    await ImageUploadService.deleteImage(currentProduct.image_public_id)
                }
            }

            const product = await ProductController.update(
                id,
                name,
                code,
                price,
                description,
                zoning,
                product_type,
                observation,
                segment,
                imageUrl,
                imagePublicId,
            )

            return res.status(200).send(product)
        } catch (e) {
            console.error("Error in updateProduct:", e)
            return res.status(400).send({ error: `Error updating product: ${e.message}` })
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params

            // Buscar produto para obter public_id da imagem antes de deletar
            const product = await ProductController.findProduct(id)

            await ProductController.delete(Number(id))

            // Deletar imagem do Cloudinary se existir
            if (product.image_public_id) {
                await ImageUploadService.deleteImage(product.image_public_id)
            }

            return res.status(204).send()
        } catch (e) {
            return res.status(400).send({ error: `Error deleting product: ${e.message}` })
        }
    }

    async findProducts(req, res) {
        try {
            const products = await ProductController.find()
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error listing products: ${e.message}` })
        }
    }

    async findProductById(req, res) {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).send({ error: "Id is required" })
            }
            const product = await ProductController.findProduct(id)
            return res.status(200).send(product)
        } catch (e) {
            return res.status(400).send({ error: `Error to get product: ${e.message}` })
        }
    }

    async findProductsByType(req, res) {
        const { type } = req.params

        try {
            if (!type) {
                return res.status(400).send({ error: "Product type is required" })
            }
            const products = await ProductController.findByType(type)
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error to get products by type: ${e.message}` })
        }
    }

    async findProductsBySegment(req, res) {
        const { segment } = req.params

        try {
            if (!segment) {
                return res.status(400).send({ error: "Segment is required" })
            }
            const products = await ProductController.findBySegment(segment)
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error to get products by segment: ${e.message}` })
        }
    }

    async findProductsByPriceRange(req, res) {
        const { minPrice, maxPrice } = req.query

        try {
            if (!minPrice || !maxPrice) {
                return res.status(400).send({ error: "Min price and max price are required" })
            }
            const products = await ProductController.findByPriceRange(Number(minPrice), Number(maxPrice))
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error to get products by price range: ${e.message}` })
        }
    }

    async bulkCreateProducts(req, res) {
        const { products } = req.body

        try {
            if (!products || !Array.isArray(products)) {
                return res.status(400).send({ error: "Products array is required" })
            }
            const createdProducts = await ProductController.bulkCreate(products)
            return res.status(201).send(createdProducts)
        } catch (e) {
            return res.status(400).send({ error: `Error creating products in bulk: ${e.message}` })
        }
    }

    async deleteAllProducts(req, res) {
        try {
            await ProductController.deleteAll()
            return res.status(204).send()
        } catch (e) {
            return res.status(400).send({ error: `Error deleting all products: ${e.message}` })
        }
    }

    async updateProductImage(req, res) {
        const { id } = req.params

        try {
            if (!req.file) {
                return res.status(400).send({ error: "Image file is required" })
            }

            console.log("File received for image update:", {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                hasBuffer: !!req.file.buffer,
            })

            // Buscar produto atual para deletar imagem antiga
            const currentProduct = await ProductController.findProduct(id)

            const uploadResult = await ImageUploadService.uploadImage(req.file, {
                folder: "products",
                public_id: `product_${id}_${Date.now()}`,
            })

            const product = await ProductController.update(
                id,
                undefined, // name
                undefined, // code
                undefined, // price
                undefined, // description
                undefined, // zoning
                undefined, // product_type
                undefined, // observation
                undefined, // segment
                uploadResult.url, // image
                uploadResult.public_id, // image_public_id
            )

            // Deletar imagem antiga do Cloudinary
            if (currentProduct.image_public_id) {
                await ImageUploadService.deleteImage(currentProduct.image_public_id)
            }

            return res.status(200).send(product)
        } catch (e) {
            console.error("Error in updateProductImage:", e)
            return res.status(400).send({ error: `Error updating product image: ${e.message}` })
        }
    }

    async getImageVariations(req, res) {
        const { id } = req.params
        const { width, height, quality } = req.query

        try {
            const product = await ProductController.findProduct(id)

            if (!product.image_public_id) {
                return res.status(404).send({ error: "Product has no image" })
            }

            const variations = {
                original: product.image,
                thumbnail: ImageUploadService.generateThumbnail(product.image_public_id),
                medium: ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: 400,
                    height: 400,
                    crop: "limit",
                    quality: "auto",
                }),
                large: ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: 800,
                    height: 800,
                    crop: "limit",
                    quality: "auto",
                }),
            }

            // Se dimensões específicas foram solicitadas
            if (width || height) {
                variations.custom = ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: width ? Number.parseInt(width) : undefined,
                    height: height ? Number.parseInt(height) : undefined,
                    crop: "limit",
                    quality: quality || "auto",
                })
            }

            return res.status(200).send(variations)
        } catch (e) {
            return res.status(400).send({ error: `Error getting image variations: ${e.message}` })
        }
    }

    // Middleware para upload de imagem
    uploadSingle() {
        return upload.single("image")
    }
}

module.exports = new ProductApi()
