const ProductService = require("../../../services/ProductService")
const ProductRepository = require("../../../repositories/ProductRepository")
const AppError = require("../../../errors/AppError")
const ImageUploadService = require("../../../services/ImageUploadService")

// Mock das dependências
jest.mock("../../../repositories/ProductRepository")
jest.mock("../../../services/ImageUploadService")

describe("ProductService", () => {
    let productService

    beforeEach(() => {
        // Obter a instância única do serviço
        productService = require("../../../services/ProductService")
        // Limpar todos os mocks antes de cada teste
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a product successfully", async () => {
            const mockProduct = {
                product_id: 1,
                name: "Test Product",
                price: 100,
                product_type: 1,
                image: "image_url",
                image_public_id: "public_id"
            }

            ProductRepository.prototype.create.mockResolvedValue(mockProduct)

            const result = await productService.create(
                "Test Product",
                null,
                100,
                null,
                null,
                1,
                null,
                null,
                "image_url",
                "public_id"
            )

            expect(result).toEqual({
                id: 1,
                name: "Test Product",
                code: undefined,
                price: 100,
                description: undefined,
                zoning: undefined,
                product_type: 1,
                observation: undefined,
                segment: undefined,
                image: "image_url",
                image_public_id: "public_id"
            })
            expect(ProductRepository.prototype.create).toHaveBeenCalledTimes(1)
        })

        it("should throw error when required fields are missing", async () => {
            await expect(productService.create(null, null, null, null, null, null))
                .rejects.toThrow(AppError)
            await expect(productService.create("Name", null, null, null, null, null))
                .rejects.toThrow(AppError)
            await expect(productService.create(null, null, 100, null, null, null))
                .rejects.toThrow(AppError)
        })

        it("should throw error when price is not positive", async () => {
            await expect(productService.create("Name", null, 0, null, null, 1))
                .rejects.toThrow(AppError)
            await expect(productService.create("Name", null, -10, null, null, 1))
                .rejects.toThrow(AppError)
        })

        it("should throw error when code already exists", async () => {
            ProductRepository.prototype.findByCode.mockResolvedValue({ product_id: 1 })

            await expect(productService.create("Name", "EXISTING_CODE", 100, null, null, 1))
                .rejects.toThrow(AppError)
        })
    })

    describe("findProduct", () => {
        it("should return product when found", async () => {
            const mockProduct = { product_id: 1, name: "Test Product" }
            ProductRepository.prototype.findById.mockResolvedValue(mockProduct)

            const result = await productService.findProduct(1)
            expect(result).toEqual(mockProduct)
        })

        it("should throw error when id is missing", async () => {
            await expect(productService.findProduct(null)).rejects.toThrow(AppError)
        })

        it("should throw error when product not found", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(null)
            await expect(productService.findProduct(999)).rejects.toThrow(AppError)
        })
    })

    describe("findByCode", () => {
        it("should return product when found by code", async () => {
            const mockProduct = { product_id: 1, code: "TEST123" }
            ProductRepository.prototype.findByCode.mockResolvedValue(mockProduct)

            const result = await productService.findByCode("TEST123")
            expect(result).toEqual(mockProduct)
        })

        it("should throw error when code is missing", async () => {
            await expect(productService.findByCode(null)).rejects.toThrow(AppError)
        })

        it("should throw error when product not found", async () => {
            ProductRepository.prototype.findByCode.mockResolvedValue(null)
            await expect(productService.findByCode("NON_EXISTENT")).rejects.toThrow(AppError)
        })
    })

    describe("update", () => {
        const existingProduct = {
            product_id: 1,
            name: "Old Name",
            code: "OLD123",
            price: 50,
            product_type: 1
        }

        beforeEach(() => {
            ProductRepository.prototype.findById.mockResolvedValue(existingProduct)
        })

        it("should update product successfully", async () => {
            const updatedProduct = { ...existingProduct, name: "New Name", price: 75 }
            ProductRepository.prototype.update.mockResolvedValue(updatedProduct)

            const result = await productService.update(1, "New Name", null, 75)
            expect(result).toEqual(updatedProduct)
        })

        it("should throw error when id is missing", async () => {
            await expect(productService.update(null, "New Name")).rejects.toThrow(AppError)
        })

        it("should throw error when trying to use existing code", async () => {
            ProductRepository.prototype.findByCode.mockResolvedValue({ product_id: 2, code: "EXISTING" })

            await expect(productService.update(1, null, "EXISTING"))
                .rejects.toThrow(AppError)
        })

        it("should allow same code for the same product", async () => {
            ProductRepository.prototype.update.mockResolvedValue(existingProduct)

            const result = await productService.update(1, null, "OLD123")
            expect(result).toEqual(existingProduct)
        })

    })

    describe("delete", () => {
        const productWithImage = {
            product_id: 1,
            name: "Test",
            image_public_id: "public_id"
        }

        it("should delete product and its image", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(productWithImage)
            ImageUploadService.deleteImage.mockResolvedValue(true)
            ProductRepository.prototype.delete.mockResolvedValue(true)

            await productService.delete(1)

            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith("public_id")
            expect(ProductRepository.prototype.delete).toHaveBeenCalledWith(1)
        })

        it("should delete product without image", async () => {
            const productWithoutImage = { ...productWithImage, image_public_id: null }
            ProductRepository.prototype.findById.mockResolvedValue(productWithoutImage)

            await productService.delete(1)

            expect(ImageUploadService.deleteImage).not.toHaveBeenCalled()
            expect(ProductRepository.prototype.delete).toHaveBeenCalledWith(1)
        })

        it("should throw error when id is missing", async () => {
            await expect(productService.delete(null)).rejects.toThrow(AppError)
        })
    })

    describe("bulkCreate", () => {
        const validProducts = [
            { name: "Product 1", price: 10, product_type: 1 },
            { name: "Product 2", price: 20, product_type: 2 }
        ]

        const invalidProducts = [
            { name: "Product 1", price: -10, product_type: 1 },
            { name: null, price: 20, product_type: 2 }
        ]

        it("should create products in bulk successfully", async () => {
            const mockCreatedProducts = validProducts.map((p, i) => ({
                product_id: i + 1,
                ...p,
                code: null,
                description: null,
                zoning: null,
                observation: null,
                segment: null,
                image: null,
                image_public_id: null
            }))

            ProductRepository.prototype.bulkCreate.mockResolvedValue(mockCreatedProducts)

            const result = await productService.bulkCreate(validProducts)
            expect(result).toHaveLength(2)
            expect(ProductRepository.prototype.bulkCreate).toHaveBeenCalledWith(validProducts)
        })

        it("should throw error when products array is invalid", async () => {
            await expect(productService.bulkCreate(null)).rejects.toThrow(AppError)
            await expect(productService.bulkCreate("not an array")).rejects.toThrow(AppError)
        })

        it("should throw error when any product is invalid", async () => {
            await expect(productService.bulkCreate(invalidProducts)).rejects.toThrow(AppError)
        })
    })

    describe("deleteAll", () => {
        it("should delete all products and their images", async () => {
            const mockProducts = [
                { product_id: 1, image_public_id: "id1" },
                { product_id: 2, image_public_id: null },
                { product_id: 3, image_public_id: "id3" }
            ]

            ProductRepository.prototype.findAll.mockResolvedValue(mockProducts)
            ImageUploadService.deleteImage.mockResolvedValue(true)
            ProductRepository.prototype.deleteAll.mockResolvedValue(true)

            await productService.deleteAll()

            expect(ProductRepository.prototype.findAll).toHaveBeenCalled()
            expect(ImageUploadService.deleteImage).toHaveBeenCalledTimes(2)
            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith("id1")
            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith("id3")
            expect(ProductRepository.prototype.deleteAll).toHaveBeenCalled()
        })
    })

    describe("searchTopProducts", () => {
        it("should return top products", async () => {
            const mockTopProducts = [
                { product_id: 1, name: "Top 1" },
                { product_id: 2, name: "Top 2" }
            ]

            ProductRepository.prototype.searchTopProducts.mockResolvedValue(mockTopProducts)

            const result = await productService.searchTopProducts()
            expect(result).toEqual(mockTopProducts)
        })

        it("should throw error when repository fails", async () => {
            ProductRepository.prototype.searchTopProducts.mockRejectedValue(new Error("DB error"))

            await expect(productService.searchTopProducts()).rejects.toThrow(AppError)
        })
    })
})