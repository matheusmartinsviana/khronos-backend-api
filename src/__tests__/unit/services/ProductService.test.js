const ProductService = require('../../../services/ProductService');
const ProductRepository = require('../../../repositories/ProductRepository');
const ImageUploadService = require('../../../services/ImageUploadService');
const AppError = require('../../../errors/AppError');

jest.mock('../../../repositories/ProductRepository');
jest.mock('../../../services/ImageUploadService');

describe('ProductService', () => {
    beforeEach(() => {
        ProductRepository.mockClear();
        ProductService.productRepository = new ProductRepository();
    });

    const mockProduct = {
        product_id: 1,
        name: 'Mouse',
        code: 'M123',
        price: 199.99,
        description: 'Mouse gamer',
        zoning: 'peripheral',
        product_type: 'hardware',
        observation: '',
        segment: 'gamer',
        image: 'image.jpg',
        image_public_id: 'public_id',
    };

    describe('create', () => {
        it('deve criar um produto com sucesso', async () => {
            ProductService.productRepository.findByCode = jest.fn().mockResolvedValue(null);
            ProductService.productRepository.create = jest.fn().mockResolvedValue(mockProduct);

            const result = await ProductService.create(
                mockProduct.name,
                mockProduct.code,
                mockProduct.price,
                mockProduct.description,
                mockProduct.zoning,
                mockProduct.product_type,
                mockProduct.observation,
                mockProduct.segment,
                mockProduct.image,
                mockProduct.image_public_id
            );

            expect(result).toEqual({
                id: 1,
                name: 'Mouse',
                code: 'M123',
                price: 199.99,
                description: 'Mouse gamer',
                zoning: 'peripheral',
                product_type: 'hardware',
                observation: '',
                segment: 'gamer',
                image: 'image.jpg',
                image_public_id: 'public_id',
            });
        });

        it('deve lançar erro se nome, preço ou tipo não forem fornecidos', async () => {
            await expect(ProductService.create(null, null, 0, null, null, null)).rejects.toThrow(
                'Name, price, and product_type are required.'
            );
        });

        it('deve lançar erro se preço for negativo ou zero', async () => {
            await expect(
                ProductService.create('Produto', 'C123', 0, 'desc', 'zone', 'tipo')
            ).rejects.toThrow('Price must be a positive number.');
        });

        it('deve lançar erro se código já existir', async () => {
            ProductService.productRepository.findByCode = jest.fn().mockResolvedValue(mockProduct);

            await expect(
                ProductService.create('Produto', 'M123', 100, 'desc', 'zone', 'tipo')
            ).rejects.toThrow('A product with this code already exists.');
        });
    });

    describe('delete', () => {
        it('deve deletar um produto e sua imagem', async () => {
            ProductService.productRepository.findById = jest.fn().mockResolvedValue(mockProduct);
            ProductService.productRepository.delete = jest.fn();
            ImageUploadService.deleteImage = jest.fn();

            await ProductService.delete(1);

            expect(ImageUploadService.deleteImage).toHaveBeenCalledWith('public_id');
            expect(ProductService.productRepository.delete).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro se id não for fornecido', async () => {
            await expect(ProductService.delete()).rejects.toThrow('Id is required');
        });
    });

    describe('findProduct', () => {
        it('deve retornar o produto se ele existir', async () => {
            ProductService.productRepository.findById = jest.fn().mockResolvedValue(mockProduct);
            const result = await ProductService.findProduct(1);
            expect(result).toEqual(mockProduct);
        });

        it('deve lançar erro se produto não for encontrado', async () => {
            ProductService.productRepository.findById = jest.fn().mockResolvedValue(null);
            await expect(ProductService.findProduct(99)).rejects.toThrow('Product not found');
        });
    });
});
