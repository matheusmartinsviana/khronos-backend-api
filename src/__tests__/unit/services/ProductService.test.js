const ProductService = require("../../../services/ProductService")
const ProductRepository = require("../../../repositories/ProductRepository")
const ImageUploadService = require("../../../services/ImageUploadService")
const AppError = require("../../../errors/AppError")

jest.mock("../../../repositories/ProductRepository")
jest.mock("../../../services/ImageUploadService")

const mockProduct = {
    product_id: 1,
    name: "Test Product",
    code: "TP001",
    price: 100,
    description: "Test Description",
    zoning: "A",
    product_type: "Electronics",
    observation: "None",
    segment: "Retail",
    image: "url",
    image_public_id: "public_id"
}

describe("ProductService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a product successfully", async () => {
            ProductRepository.prototype.findByCode.mockResolvedValue(null)
            ProductRepository.prototype.create.mockResolvedValue(mockProduct)

            const result = await ProductService.create(
                "Test Product", "TP001", 100, "Test Description", "A", "Electronics", "None", "Retail", "url", "public_id"
            )

            expect(result).toEqual({
                id: 1,
                name: "Test Product",
                code: "TP001",
                price: 100,
                description: "Test Description",
                zoning: "A",
                product_type: "Electronics",
                observation: "None",
                segment: "Retail",
                image: "url",
                image_public_id: "public_id"
            })
        })

        it("should throw error if price is zero", async () => {
            await expect(ProductService.create("Test", "CODE", 0, "", "", "Type"))
                .rejects.toThrow("Price must be a positive number.")
        })

        it("should throw error if product code already exists", async () => {
            ProductRepository.prototype.findByCode.mockResolvedValue(mockProduct)

            await expect(ProductService.create("Test", "TP001", 100, "", "", "Type"))
                .rejects.toThrow("A product with this code already exists.")
        })
    })

    describe("findProduct", () => {
        it("should return a product by ID", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(mockProduct)

            const result = await ProductService.findProduct(1)
            expect(result).toEqual(mockProduct)
        })

        it("should throw error if product not found", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(null)

            await expect(ProductService.findProduct(999)).rejects.toThrow("Product not found")
        })
    })

    describe("update", () => {
        it("should update product successfully", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(mockProduct)
            ProductRepository.prototype.findByCode.mockResolvedValue(null)
            ProductRepository.prototype.update.mockResolvedValue({ ...mockProduct, name: "Updated" })

            const result = await ProductService.update(1, "Updated")

            expect(result.name).toBe("Updated")
        })

        it("should throw error if updating to existing code", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(mockProduct)
            ProductRepository.prototype.findByCode.mockResolvedValue({ ...mockProduct, product_id: 2 })

            await expect(ProductService.update(1, "Test", "TP001")).rejects.toThrow("A product with this code already exists.")
        })
    })

    describe("delete", () => {
        it("should delete product and its image", async () => {
            ProductRepository.prototype.findById.mockResolvedValue(mockProduct)
            ProductRepository.prototype.delete.mockResolvedValue(true)

            await ProductService.delete(1)

            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith("public_id")
            expect(ProductRepository.prototype.delete).toHaveBeenCalledWith(1)
        })
    })

    describe("bulkCreate", () => {
        it("should create multiple products", async () => {
            ProductRepository.prototype.bulkCreate.mockResolvedValue([mockProduct])

            const result = await ProductService.bulkCreate([mockProduct])

            expect(result.length).toBe(1)
            expect(result[0].name).toBe("Test Product")
        })

        it("should throw error on invalid product", async () => {
            const invalidProduct = { price: -10, name: "", product_type: "" }

            await expect(ProductService.bulkCreate([invalidProduct]))
                .rejects.toThrow("Product at index 0: Name, price, and product_type are required.")
        })
    })

    describe("deleteAll", () => {
        it("should delete all products and their images", async () => {
            ProductRepository.prototype.findAll.mockResolvedValue([mockProduct])
            ProductRepository.prototype.deleteAll.mockResolvedValue(true)

            await ProductService.deleteAll()

            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith("public_id")
            expect(ProductRepository.prototype.deleteAll).toHaveBeenCalled()
        })
    })

    describe("searchTopProducts", () => {
        it("should return top products", async () => {
            ProductRepository.prototype.searchTopProducts.mockResolvedValue([mockProduct])

            const result = await ProductService.searchTopProducts()
            expect(result.length).toBe(1)
        })
    })
})
