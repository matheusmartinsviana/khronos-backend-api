// src/__tests__/unit/services/CategoryService.test.js
const CategoryService = require('../../../services/CategoryService')
const AppError = require('../../../errors/AppError')
const CategoryRepository = require('../../../repositories/CategoryRepository')

jest.mock('../../../repositories/CategoryRepository')

describe('CategoryService', () => {
    const mockCategory = { category_id: 1, name: 'Electronics' }

    beforeEach(() => {
        // Reset mocks antes de cada teste
        CategoryRepository.mockClear()
        CategoryService.categoryRepository = new CategoryRepository()
    })

    describe('create', () => {
        it('deve criar uma nova categoria com sucesso', async () => {
            CategoryService.categoryRepository.findByName = jest.fn().mockResolvedValue(null)
            CategoryService.categoryRepository.create = jest.fn().mockResolvedValue(mockCategory)

            const result = await CategoryService.create('Electronics')

            expect(result).toEqual({ id: 1, name: 'Electronics' })
        })

        it('deve lançar erro se o nome não for fornecido', async () => {
            await expect(CategoryService.create()).rejects.toThrow(AppError)
        })

        it('deve lançar erro se a categoria já existir', async () => {
            CategoryService.categoryRepository.findByName = jest.fn().mockResolvedValue(mockCategory)

            await expect(CategoryService.create('Electronics')).rejects.toThrow('A category with this name already exists.')
        })
    })

    describe('findCategory', () => {
        it('deve retornar a categoria se ela existir', async () => {
            CategoryService.categoryRepository.findById = jest.fn().mockResolvedValue(mockCategory)

            const result = await CategoryService.findCategory(1)
            expect(result).toEqual(mockCategory)
        })

        it('deve lançar erro se id não for fornecido', async () => {
            await expect(CategoryService.findCategory()).rejects.toThrow('Id is required')
        })

        it('deve lançar erro se a categoria não for encontrada', async () => {
            CategoryService.categoryRepository.findById = jest.fn().mockResolvedValue(null)

            await expect(CategoryService.findCategory(99)).rejects.toThrow('Category not found')
        })
    })

    describe('delete', () => {
        it('deve deletar uma categoria sem produtos', async () => {
            CategoryService.categoryRepository.countProductsByCategory = jest.fn().mockResolvedValue(0)
            CategoryService.categoryRepository.findById = jest.fn().mockResolvedValue(mockCategory)
            CategoryService.categoryRepository.delete = jest.fn().mockResolvedValue()

            await expect(CategoryService.delete(1)).resolves.toBeUndefined()
        })

        it('deve lançar erro se houver produtos associados', async () => {
            CategoryService.categoryRepository.countProductsByCategory = jest.fn().mockResolvedValue(3)

            await expect(CategoryService.delete(1)).rejects.toThrow('Cannot delete category: 3 products are associated with this category.')
        })
    })
})
