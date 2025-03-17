const AuthService = require('../../services/authService');
const User = require('../../models/user');
const mockingoose = require('mockingoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
                nome: 'User',
                dataNascimento: '2000-01-01',
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
            expect(response).toHaveProperty('refreshToken');
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

    describe('authService.refreshAccessToken', () => {
        it('should return a new access token and refresh token for a valid refresh token', async () => {
            const mockUser = new User({
                _id: '64feba7fbc13adf42caa92a1',
                email: 'test@example.com',
                nome: 'User',
                dataNascimento: '2000-01-01',
                password: 'hashedpassword',
                refreshToken: 'valid-refresh-token',
                refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // Token válido por 1 dia
            });

            mockingoose(User).toReturn(mockUser, 'findOne');
            mockUser.save = jest.fn().mockResolvedValue(mockUser);

            const response = await AuthService.refreshAccessToken('valid-refresh-token');

            expect(response).toHaveProperty('token', 'mocked-jwt-token');
            expect(response).toHaveProperty('refreshToken');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should throw an error if refresh token is expired', async () => {
            const expiredUser = new User({
                _id: '64feba7fbc13adf42caa92a1',
                email: 'test@example.com',
                nome: 'User',
                dataNascimento: '2000-01-01',
                password: 'hashedpassword',
                refreshToken: 'expired-refresh-token',
                refreshTokenExpiresAt: new Date(Date.now() - 1000 * 60 * 60) // Expirado há 1 hora
            });

            mockingoose(User).toReturn(expiredUser, 'findOne');

            await expect(AuthService.refreshAccessToken('expired-refresh-token'))
                .rejects.toThrow('Refresh Token expirado ou inválido');
        });

        it('should throw an error if refresh token is invalid (not found)', async () => {
            mockingoose(User).toReturn(null, 'findOne');

            await expect(AuthService.refreshAccessToken('invalid-refresh-token'))
                .rejects.toThrow('Refresh Token expirado ou inválido');
        });
    });

    describe('authService.logout', () => {
        it('should remove refresh token when user logs out', async () => {
            const userId = '64feba7fbc13adf42caa92a1';
            const mockUser = new User({
                id: userId,
                email: 'test@example.com',
                nome: 'User',
                dataNascimento: "2000-01-01",
                password: 'hashedpassword',
                refreshToken: 'valid-refresh-token'
            });

            mockingoose(User).toReturn(mockUser, 'findOneAndUpdate');

            const response = await AuthService.logout(userId);

            expect(response).toEqual(mockUser);
        });

        it('should throw an error if user is not found', async () => {
            mockingoose(User).toReturn(null, 'findByIdAndUpdate');

            await expect(AuthService.logout('invalid-user-id'))
                .rejects.toThrow('Usuário não encontrado');
        });
    });
});
