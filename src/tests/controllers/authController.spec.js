const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

// removing logging from tests for better reading
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
});
  
afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
});

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
        const mockResponse = { token: 'mocked-jwt-token', refreshToken: 'valid-refresh-token', user: { id: '12345', email: 'test@example.com' } };

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

describe('authController.refreshAccessToken', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should return 200 and a valid token and refresh token if valid access token is provided', async () => {
        const mockResponse = { token: 'mocked-jwt-token', refreshToken: 'valid-refresh-token' };

        authService.refreshAccessToken.mockResolvedValue(mockResponse);

        req.body = { refreshToken: 'refresh-token' };
        await authController.refreshAccessToken(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
        expect(authService.refreshAccessToken).toHaveBeenCalledWith('refresh-token');
    });

    it('should return 400 if refresh token is not provided', async () => {
        req.body = { };
        await authController.refreshAccessToken(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Refresh Token é obrigatório' });
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('shoudl return 401 if Refresh Token expired', async () => {
        authService.refreshAccessToken.mockRejectedValue(new Error('Refresh Token expirado ou inválido'));

        req.body = { refreshToken: 'refresh-token' };
        await authController.refreshAccessToken(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Refresh Token expirado ou inválido' });
    });

    it('should return 500 in case of internal server error', async () => {
        authService.refreshAccessToken.mockRejectedValue(new Error('Erro inesperado'));

        req.body = { refreshToken: 'refresh-token' };
        await authController.refreshAccessToken(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});

describe('authController.logout', () => {
    let req, res;

    beforeEach(() => {
        req = { user: { userId: '12345' } };  // Mocking the userId from the request object (usually populated by middleware)
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should return 200 and a success message when logout is successful', async () => {
        const mockResponse = { message: "Logout realizado com sucesso" };

        authService.logout.mockResolvedValue(mockResponse);

        await authController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Logout realizado com sucesso" });
    });

    it('should return 404 if user is not found in the database', async () => {
        authService.logout.mockRejectedValue(new Error('Usuário não encontrado'));

        await authController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should return 500 if there is an internal server error', async () => {
        authService.logout.mockRejectedValue(new Error('Erro inesperado'));

        await authController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});