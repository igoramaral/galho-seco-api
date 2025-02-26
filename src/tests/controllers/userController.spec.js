const userController = require('../../controllers/userController');
const userService = require('../../services/userService');
const DuplicateKeyError = require('../../errors/duplicatedKeyError');

jest.mock('../../services/userService');

describe("userController.createUser", ()=>{

    let req, res;

    beforeEach(()=>{
        req = {
                body: { 
                    nome: "João das Neves", 
                    email: "test@email.com", 
                    password: "123", 
                    dataNascimento: "2000-01-01" 
                }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    
    it("should return 201 and user when user created correctly", async ()=>{
        let mockUser = { _id: "65a1234567890abcde123456", ...req.body };
        userService.createUser.mockResolvedValue(mockUser);

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    })

    it("should return 400 when trying to create user with an used email", async () => {
        userService.createUser.mockRejectedValue(new DuplicateKeyError("email", "email já está em uso"));

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            error: "DuplicateKeyError",
            field: "email",
            message: "email já está em uso"
         });
    })

    it("should return 500 when error thrown", async ()=>{
        userService.createUser.mockRejectedValue(new Error());

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe("userController.getUser", ()=>{

    let req, res;

    beforeEach(()=>{
        req = { params: { id: "65a1234567890abcde123456" } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    
    it("should return 200 and user when user found", async ()=>{
        req.userId = "65a1234567890abcde123456";
        let mockUser = { _id: "65a1234567890abcde123456", nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
        userService.findUser.mockResolvedValue(mockUser);

        await userController.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    })

    it("should return 404 when user not found", async () => {
        req.userId = "65a1234567890abcde123456";
        userService.findUser.mockRejectedValue(new Error());

        await userController.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
    })

    it("should return 403 when trying to get different user", async () => {
        req.userId = "abobrinha";

        await userController.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Você não tem permissão para obter outro perfil" });
    })
})

describe("userController.updateUser", ()=>{

    let req, res;

    beforeEach(()=>{
        req = {
                params: { id: "65a1234567890abcde123456" },
                body: { 
                    _id: "65a1234567890abcde123456",
                    nome: "João das Neves", 
                    email: "test@email.com", 
                    password: "123", 
                    dataNascimento: "2000-01-01" 
                }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    
    it("should return 200 and user when user updated correctly", async ()=>{
        req.userId = "65a1234567890abcde123456";
        let mockUser = req.body;
        userService.updateUser.mockResolvedValue(mockUser);

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    })

    it("should return 404 when user not found", async ()=>{
        req.userId = "65a1234567890abcde123456";
        userService.updateUser.mockRejectedValue(new Error("Usuário não encontrado"));

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
    })

    it("should return 400 when trying to update an user with an used email", async () => {
        req.userId = "65a1234567890abcde123456";
        userService.updateUser.mockRejectedValue(new DuplicateKeyError("email", "email já está em uso"));

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            error: "DuplicateKeyError",
            field: "email",
            message: "email já está em uso"
         });
    })

    it("should return 500 when error thrown", async ()=>{
        req.userId = "65a1234567890abcde123456";
        userService.updateUser.mockRejectedValue(new Error());

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })

    it("should return 403 when trying to update other user", async () => {
        req.userId = "abobrinha";
        userService.updateUser.mockRejectedValue(new Error());

        await userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Você não tem permissão para editar outro perfil" });
    })
})

describe("userController.deleteUser", ()=>{

    let req, res;

    beforeEach(()=>{
        req = { params: { id: "65a1234567890abcde123456" } };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    
    it("should return 200 and user when user deleted", async ()=>{
        req.userId = "65a1234567890abcde123456";
        let mockUser = { _id: "65a1234567890abcde123456", nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
        userService.deleteUser.mockResolvedValue(mockUser);

        await userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuário excluído com sucesso" });
    })

    it("should return 404 when user not found", async () => {
        req.userId = "65a1234567890abcde123456";
        userService.deleteUser.mockRejectedValue(new Error("Usuário não encontrado"));

        await userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
    })

    it("should return 500 when error thrown", async ()=>{
        req.userId = "65a1234567890abcde123456";
        userService.deleteUser.mockRejectedValue(new Error());

        await userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })

    it("should return 403 when trying to update other user", async () => {
        req.userId = "abobrinha";
        userService.updateUser.mockRejectedValue(new Error());

        await userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Você não tem permissão para deletar outro perfil" });
    })
})