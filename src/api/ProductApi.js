const ProductController = require("../controllers/ProductController")

class ProductApi {
    async createProduct(req, res) {
        const { name, code, price, description, zoning, product_type, observation, segment, image } = req.body

        try {
            const product = await ProductController.create(
                name,
                code,
                price,
                description,
                zoning,
                product_type,
                observation,
                segment,
                image,
            )
            return res.status(201).send(product)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params
        const { name, code, price, description, zoning, product_type, observation, segment, image } = req.body

        try {
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
                image,
            )
            return res.status(200).send(product)
        } catch (e) {
            return res.status(400).send({ error: `Error updating product: ${e.message}` })
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params

            await ProductController.delete(Number(id))
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
}

module.exports = new ProductApi()
