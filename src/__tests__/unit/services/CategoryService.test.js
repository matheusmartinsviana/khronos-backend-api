const CategoryService = require('../../../services/CategoryService')
const CategoryRepository = require('../../../repositories/CategoryRepository')
const AppError = require('../../../errors/AppError')

jest.mock('../../../repositories/CategoryRepository')

describe('CategoryService', () => {

    const mockCategoryRepo = {
        findByName: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
        bulkCreate: jest.fn(),
        countProductsByCategory: jest.fn(),
        getProductsByCategory: jest.fn(),
    }

    beforeEach(() => {
        CategoryService.categoryRepository = mockCategoryRepo
        jest.clearAllMocks()
    })

    describe('create', () => {
        it('should create a category successfully', async () => {
            mockCategoryRepo.findByName.mockResolvedValue(null)
            mockCategoryRepo.create.mockResolvedValue({ category_id: 1, name: 'Test' })

            const result = await CategoryService.create('Test')

            expect(result).toEqual({ id: 1, name: 'Test' })
        })

        it('should throw if name is missing', async () => {
            await expect(CategoryService.create()).rejects.toThrow(AppError)
        })

        it('should throw if category already exists', async () => {
            mockCategoryRepo.findByName.mockResolvedValue({ category_id: 1, name: 'Test' })

            await expect(CategoryService.create('Test')).rejects.toThrow(AppError)
        })
    })

    describe('findCategory', () => {
        it('should return category by id', async () => {
            mockCategoryRepo.findById.mockResolvedValue({ category_id: 1, name: 'Test' })
            const result = await CategoryService.findCategory(1)
            expect(result).toEqual({ category_id: 1, name: 'Test' })
        })

        it('should throw if id is missing', async () => {
            await expect(CategoryService.findCategory()).rejects.toThrow(AppError)
        })

        it('should throw if category not found', async () => {
            mockCategoryRepo.findById.mockResolvedValue(null)
            await expect(CategoryService.findCategory(999)).rejects.toThrow(AppError)
        })
    })

    describe('findByName', () => {
        it('should return category by name', async () => {
            mockCategoryRepo.findByName.mockResolvedValue({ category_id: 1, name: 'Test' })
            const result = await CategoryService.findByName('Test')
            expect(result).toEqual({ category_id: 1, name: 'Test' })
        })

        it('should throw if name is missing', async () => {
            await expect(CategoryService.findByName()).rejects.toThrow(AppError)
        })

        it('should throw if category not found', async () => {
            mockCategoryRepo.findByName.mockResolvedValue(null)
            await expect(CategoryService.findByName('NotFound')).rejects.toThrow(AppError)
        })
    })

    describe('update', () => {
        it('should update category name successfully', async () => {
            mockCategoryRepo.findById.mockResolvedValue({ category_id: 1, name: 'Old' })
            mockCategoryRepo.findByName.mockResolvedValue(null)
            mockCategoryRepo.update.mockResolvedValue({ category_id: 1, name: 'New' })

            const result = await CategoryService.update(1, 'New')
            expect(result).toEqual({ category_id: 1, name: 'New' })
        })

        it('should throw if id or name is missing', async () => {
            await expect(CategoryService.update()).rejects.toThrow(AppError)
        })

        it('should throw if category name already exists', async () => {
            mockCategoryRepo.findById.mockResolvedValue({ category_id: 1, name: 'Old' })
            mockCategoryRepo.findByName.mockResolvedValue({ category_id: 2, name: 'New' })

            await expect(CategoryService.update(1, 'New')).rejects.toThrow(AppError)
        })
    })

    describe('delete', () => {
        it('should delete category successfully', async () => {
            mockCategoryRepo.countProductsByCategory.mockResolvedValue(0)
            mockCategoryRepo.findById.mockResolvedValue({ category_id: 1, name: 'ToDelete' })
            mockCategoryRepo.delete.mockResolvedValue()

            await expect(CategoryService.delete(1)).resolves.not.toThrow()
        })

        it('should throw if id is missing', async () => {
            await expect(CategoryService.delete()).rejects.toThrow(AppError)
        })

        it('should throw if category has associated products', async () => {
            mockCategoryRepo.countProductsByCategory.mockResolvedValue(3)
            await expect(CategoryService.delete(1)).rejects.toThrow(AppError)
        })
    })

    describe('find', () => {
        it('should return all categories', async () => {
            mockCategoryRepo.findAll.mockResolvedValue([{ category_id: 1, name: 'Test' }])
            const result = await CategoryService.find()
            expect(result).toEqual([{ category_id: 1, name: 'Test' }])
        })
    })

    describe('bulkCreate', () => {
        it('should create multiple categories successfully', async () => {
            const categories = [{ name: 'Cat1' }, { name: 'Cat2' }]
            mockCategoryRepo.bulkCreate.mockResolvedValue([
                { category_id: 1, name: 'Cat1' },
                { category_id: 2, name: 'Cat2' }
            ])

            const result = await CategoryService.bulkCreate(categories)
            expect(result).toEqual([
                { id: 1, name: 'Cat1' },
                { id: 2, name: 'Cat2' }
            ])
        })

        it('should throw if categories is not an array', async () => {
            await expect(CategoryService.bulkCreate(null)).rejects.toThrow(AppError)
        })

        it('should throw if one category is missing name', async () => {
            const categories = [{ name: 'Valid' }, {}]
            await expect(CategoryService.bulkCreate(categories)).rejects.toThrow(AppError)
        })
    })

    describe('getProductsByCategory', () => {
        it('should return products of a category', async () => {
            mockCategoryRepo.findById.mockResolvedValue({ category_id: 1, name: 'Cat' })
            mockCategoryRepo.getProductsByCategory.mockResolvedValue([{ product_id: 1, name: 'Prod' }])

            const result = await CategoryService.getProductsByCategory(1)
            expect(result).toEqual([{ product_id: 1, name: 'Prod' }])
        })

        it('should throw if categoryId is missing', async () => {
            await expect(CategoryService.getProductsByCategory()).rejects.toThrow(AppError)
        })
    })
})
