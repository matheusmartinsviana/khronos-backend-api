const Customer = require('../../../models/CustomerModel');
const CustomerService = require('../../../services/CustomerService');
const AppError = require('../../../errors/AppError');
jest.mock('../../../models/CustomerModel');

describe('CustomerService - create', () => {
    it('deve criar um cliente com sucesso', async () => {
        const mockData = {
            name: 'João',
            email: 'joao@email.com',
            contact: '999999999',
            observation: 'Cliente VIP',
            adress: 'Rua A',
            cep: '12345-678'
        };

        Customer.create.mockResolvedValue(mockData);

        const result = await CustomerService.create(
            mockData.name,
            mockData.email,
            mockData.contact,
            mockData.observation,
            mockData.adress,
            mockData.cep
        );

        expect(Customer.create).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });

    it('deve lançar erro para email inválido', async () => {
        const error = {
            errors: [{ validatorKey: 'isEmail' }]
        };

        Customer.create.mockRejectedValue(error);

        await expect(
            CustomerService.create('João', 'email_invalido', '9999', '', '', '')
        ).rejects.toThrow(AppError);

        await expect(
            CustomerService.create('João', 'email_invalido', '9999', '', '', '')
        ).rejects.toThrow('Invalid email format.');
    });
});

describe('CustomerService - findById', () => {
    it('deve retornar o cliente se encontrado', async () => {
        const mockCustomer = { id: 1, name: 'Maria' };
        Customer.findByPk.mockResolvedValue(mockCustomer);

        const result = await CustomerService.findById(1);
        expect(result).toEqual(mockCustomer);
    });

    it('deve lançar erro se o cliente não for encontrado', async () => {
        Customer.findByPk.mockResolvedValue(null);

        await expect(CustomerService.findById(999)).rejects.toThrow(AppError);
        await expect(CustomerService.findById(999)).rejects.toThrow('Customer not found');
    });
});

describe('CustomerService - update', () => {
    it('deve atualizar e retornar o cliente', async () => {
        const mockCustomer = {
            save: jest.fn(),
            name: '',
            email: '',
            contact: '',
            observation: '',
            adress: '',
            cep: ''
        };

        CustomerService.findById = jest.fn().mockResolvedValue(mockCustomer);

        const result = await CustomerService.update(1, 'Novo Nome', 'novo@email.com', '0000', 'obs', 'Rua B', '00000-000');

        expect(mockCustomer.save).toHaveBeenCalled();
        expect(result.name).toBe('Novo Nome');
        expect(result.email).toBe('novo@email.com');
    });
});

describe('CustomerService - delete', () => {
    it('deve deletar o cliente', async () => {
        const mockCustomer = { destroy: jest.fn() };
        CustomerService.findById = jest.fn().mockResolvedValue(mockCustomer);

        await CustomerService.delete(1);

        expect(mockCustomer.destroy).toHaveBeenCalled();
    });
});
