const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('authController.login', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should return 200 and a valid token if valid credentials are provided', async () => {
        const mockResponse = { token: 'mocked-jwt-token', user: { id: '12345', email: 'test@example.com' } };

        authService.login.mockResolvedValue(mockResponse);

        req.body = { email: 'test@example.com', password: 'validpassword' };
        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'validpassword');
    });

    it('should return 400 if email or password are not provided', async () => {
        req.body = { email: 'test@example.com' };
        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email e Senha são obrigatórios' });
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('shoudl return 401 if user is not found', async () => {
        authService.login.mockRejectedValue(new Error('Usuário não encontrado'));

        req.body = { email: 'notfound@example.com', password: 'somepassword' };
        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should return 401 if password is incorrect', async () => {
        authService.login.mockRejectedValue(new Error('Senha incorreta'));

        req.body = { email: 'test@example.com', password: 'wrongpassword' };
        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Senha incorreta' });
    });

    it('should return 500 in case of internal server error', async () => {
        authService.login.mockRejectedValue(new Error('Erro inesperado'));

        req.body = { email: 'test@example.com', password: 'validpassword' };
        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
