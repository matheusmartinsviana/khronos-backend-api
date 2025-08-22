const ProductController = require("../controllers/ProductController");
const ImageUploadService = require("../services/ImageUploadService");
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

class ProductApi {
    _validateId(id) {
        if (!id || isNaN(Number(id))) {
            throw new Error("Valid ID is required");
        }
        return Number(id);
    }

    _validateProductData(data) {
        const { name, code, price, description, zoning, product_type, observation, segment } = data;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error("Valid name is required");
        }

        if (code && typeof code !== 'string') {
            throw new Error("Code must be a valid string");
        }

        if (price && (isNaN(Number(price)) || Number(price) < 0)) {
            throw new Error("Valid price is required");
        }

        return {
            name: name.trim(),
            code: code?.trim() || null,
            price: price ? Number(price) : null,
            description: description?.trim() || null,
            zoning: zoning?.trim() || null,
            product_type: product_type?.trim() || null,
            observation: observation?.trim() || null,
            segment: segment?.trim() || null
        };
    }

    _validateImageFile(file) {
        if (!file || !file.buffer) {
            throw new Error("Valid image file is required");
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error("Image file size must be less than 10MB");
        }

        return file;
    }

    _handleError(res, error, defaultMessage = "Internal server error") {
        console.error(`ProductApi Error: ${error.message}`, error);

        const statusCode = error.statusCode || 400;
        const message = error.message || defaultMessage;

        return res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    async _handleImageUpload(file, options = {}) {
        if (!file) return { imageUrl: null, imagePublicId: null };

        const validatedFile = this._validateImageFile(file);

        console.log("File received:", {
            originalname: validatedFile.originalname,
            mimetype: validatedFile.mimetype,
            size: validatedFile.size,
            hasBuffer: !!validatedFile.buffer,
            bufferLength: validatedFile.buffer ? validatedFile.buffer.length : 0
        });

        const uploadResult = await ImageUploadService.uploadImage(validatedFile, {
            folder: "products",
            ...options
        });

        console.log("Upload successful:", {
            imageUrl: uploadResult.url,
            imagePublicId: uploadResult.public_id
        });

        return {
            imageUrl: uploadResult.url,
            imagePublicId: uploadResult.public_id
        };
    }

    async _deleteOldImage(publicId) {
        if (publicId) {
            try {
                await ImageUploadService.deleteImage(publicId);
            } catch (error) {
                console.error("Error deleting old image:", error);
            }
        }
    }

    async createProduct(req, res) {
        try {
            const validatedData = this._validateProductData(req.body);
            const { imageUrl, imagePublicId } = await this._handleImageUpload(req.file, {
                public_id: `product_${Date.now()}`
            });

            const product = await ProductController.create(
                validatedData.name,
                validatedData.code,
                validatedData.price,
                validatedData.description,
                validatedData.zoning,
                validatedData.product_type,
                validatedData.observation,
                validatedData.segment,
                imageUrl,
                imagePublicId
            );

            return res.status(201).json({
                success: true,
                data: product,
                message: "Product created successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating product");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const validatedData = this._validateProductData(req.body);

            let imageUrl = undefined;
            let imagePublicId = undefined;

            if (req.file) {
                const currentProduct = await ProductController.findProduct(id);

                const uploadResult = await this._handleImageUpload(req.file, {
                    public_id: `product_${id}_${Date.now()}`
                });

                imageUrl = uploadResult.imageUrl;
                imagePublicId = uploadResult.imagePublicId;

                await this._deleteOldImage(currentProduct?.image_public_id);
            }

            const product = await ProductController.update(
                id,
                validatedData.name,
                validatedData.code,
                validatedData.price,
                validatedData.description,
                validatedData.zoning,
                validatedData.product_type,
                validatedData.observation,
                validatedData.segment,
                imageUrl,
                imagePublicId
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: product,
                message: "Product updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating product");
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const product = await ProductController.findProduct(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found"
                });
            }

            await ProductController.delete(id);
            await this._deleteOldImage(product.image_public_id);

            return res.status(204).send();
        } catch (error) {
            return this._handleError(res, error, "Error deleting product");
        }
    }

    async findProducts(req, res) {
        try {
            const { page = 1, limit = 10, search, category, environment, priceMin, priceMax } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit),
                search: search?.trim(),
                category: category?.trim(),
                environment: environment?.trim(),
                priceMin: priceMin ? Number(priceMin) : undefined,
                priceMax: priceMax ? Number(priceMax) : undefined
            };

            const products = await ProductController.find(options);

            return res.status(200).json({
                success: true,
                data: products,
                message: "Products retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error listing products");
        }
    }

    async findProductById(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const product = await ProductController.findProduct(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: product,
                message: "Product retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving product");
        }
    }

    async findProductsByEnvironment(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const { page = 1, limit = 10 } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit)
            };

            const products = await ProductController.findProductsByEnvironment(id, options);

            return res.status(200).json({
                success: true,
                data: products,
                message: "Products retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving products by environment");
        }
    }

    async bulkCreateProducts(req, res) {
        try {
            const { products } = req.body;

            if (!products || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Valid products array is required"
                });
            }

            const validatedProducts = products.map(product =>
                this._validateProductData(product)
            );

            const createdProducts = await ProductController.bulkCreate(validatedProducts);

            return res.status(201).json({
                success: true,
                data: createdProducts,
                message: `${createdProducts.length} products created successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating products in bulk");
        }
    }

    async deleteAllProducts(req, res) {
        try {
            const deletedCount = await ProductController.deleteAll();

            return res.status(200).json({
                success: true,
                message: `${deletedCount} products deleted successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error deleting all products");
        }
    }

    async updateProductImage(req, res) {
        try {
            const id = this._validateId(req.params.id);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "Image file is required"
                });
            }

            const currentProduct = await ProductController.findProduct(id);

            if (!currentProduct) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found"
                });
            }

            const { imageUrl, imagePublicId } = await this._handleImageUpload(req.file, {
                public_id: `product_${id}_${Date.now()}`
            });

            const product = await ProductController.update(
                id,
                undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined,
                imageUrl, imagePublicId
            );

            await this._deleteOldImage(currentProduct.image_public_id);

            return res.status(200).json({
                success: true,
                data: product,
                message: "Product image updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating product image");
        }
    }

    async getImageVariations(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const { width, height, quality } = req.query;

            const product = await ProductController.findProduct(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found"
                });
            }

            if (!product.image_public_id) {
                return res.status(404).json({
                    success: false,
                    error: "Product has no image"
                });
            }

            const variations = {
                original: product.image,
                thumbnail: ImageUploadService.generateThumbnail(product.image_public_id),
                medium: ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: 400,
                    height: 400,
                    crop: "limit",
                    quality: "auto"
                }),
                large: ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: 800,
                    height: 800,
                    crop: "limit",
                    quality: "auto"
                })
            };

            if (width || height) {
                variations.custom = ImageUploadService.generateImageUrl(product.image_public_id, {
                    width: width ? Number.parseInt(width) : undefined,
                    height: height ? Number.parseInt(height) : undefined,
                    crop: "limit",
                    quality: quality || "auto"
                });
            }

            return res.status(200).json({
                success: true,
                data: variations,
                message: "Image variations retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error getting image variations");
        }
    }

    async searchTopProducts(req, res) {
        try {
            const { limit = 10 } = req.query;

            const products = await ProductController.searchTopProducts(Number(limit));

            return res.status(200).json({
                success: true,
                data: products,
                message: "Top products retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error searching top products");
        }
    }

    uploadSingle() {
        return upload.single("image");
    }
}

module.exports = new ProductApi();
