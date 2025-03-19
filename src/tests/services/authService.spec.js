const AuthService = require('../../services/authService');
const User = require('../../models/user');
const mockingoose = require('mockingoose');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mocked-jwt-token')
}));

describe('AuthService', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('authService.login', () => {
        it('should return token and user data when providing valid credentials', async () => {
            const mockUser = new User({
                id: '64feba7fbc13adf42caa92a1',
                email: 'test@example.com',
                password: 'hashedpassword'
            });

            mockUser.checkPassword = jest.fn().mockResolvedValue(true);

            mockUser.toObject = jest.fn().mockReturnValue({
                id: '64feba7fbc13adf42caa92a1',
                email: 'test@example.com',
                password: undefined // Para garantir que a senha não seja exposta
            });

            mockingoose(User).toReturn(mockUser, 'findOne');

            const response = await AuthService.login('test@example.com', 'validpassword');

            expect(response).toHaveProperty('token', 'mocked-jwt-token');
            expect(response.user).toHaveProperty('id', '64feba7fbc13adf42caa92a1');
            expect(response.user).not.toHaveProperty('_id');
            expect(response.user).not.toHaveProperty('password');
        });

        it('should throw error in case of wrong credentials', async () => {
            const mockUser = {
                _id: '64feba7fbc13adf42caa92a1',
                email: 'test@example.com',
                password: 'hashedpassword', // Certifique-se de incluir o password
                checkPassword: jest.fn().mockResolvedValue(false) // Simulando senha errada
            };

            mockingoose(User).toReturn(mockUser, 'findOne');

            await expect(AuthService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Senha incorreta');
        });

        it('should throw error in case of user not found', async () => {
            mockingoose(User).toReturn(null, 'findOne');

            await expect(AuthService.login('notfound@example.com', 'password'))
                .rejects.toThrow('Usuário não encontrado');
        });

    });

    describe("authService.updatePassword", () => {
        let mockUser;

        beforeEach(() => {
            mockUser = new User({
                nome: 'Test User',
                email: 'testuser@example.com',
                dataNascimento: new Date(),
                password: 'hashedpassword', // Pode ser qualquer valor de senha aqui
                isVerified: true,
                stats: {
                    characters: 1,
                    numRoll: 2,
                    medRoll: 3,
                    numCriticalSuccess: 0,
                    numCriticalFail: 0,
                },
            });

            // Mocking the checkPassword method to return a resolved value
            mockUser.checkPassword = jest.fn().mockResolvedValue(true); // Simulando senha válida
        });

        it('should update user password and return new tokens', async () => {
            // Mocking User.findOne to return the mockUser instance
            mockingoose(User).toReturn(mockUser, 'findOne');

            const mockUserId = mockUser._id;
            const mockPassword = 'oldpassword';
            const mockNewPassword = 'newpassword';

            const result = await AuthService.updatePassword(mockUserId, mockPassword, mockNewPassword);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('refreshToken');
            expect(mockUser.checkPassword).toHaveBeenCalledWith(mockPassword); // Verificando se o checkPassword foi chamado corretamente
        });

        it('should throw error if password is incorrect', async () => {
            // Simulando que a senha não é válida
            mockUser.checkPassword.mockResolvedValue(false);

            mockingoose(User).toReturn(mockUser, 'findOne');

            const mockUserId = mockUser._id;
            const mockPassword = 'wrongpassword';
            const mockNewPassword = 'newpassword';

            await expect(AuthService.updatePassword(mockUserId, mockPassword, mockNewPassword))
                .rejects
                .toThrow('Senha incorreta');
        });
    });

    it('should throw error if user is not found', async () => {
        // Mocking User.findOne to return null (usuário não encontrado)
        mockingoose(User).toReturn(null, 'findOne');
    
        const mockUserId = 'nonexistentUserId';
        const mockPassword = 'anyPassword';
        const mockNewPassword = 'newpassword';
    
        await expect(AuthService.updatePassword(mockUserId, mockPassword, mockNewPassword))
            .rejects
            .toThrow('Usuário não encontrado');
    });
});
