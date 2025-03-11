const userService = require('../../services/userService');
const User =  require('../../models/user');
const Character = require('../../models/character');
const mockingoose = require('mockingoose');
const DuplicateKeyError = require('../../errors/duplicatedKeyError');
const MissingKeyError = require('../../errors/missingKeyError');

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

describe("userService.createUser", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it ('should create user if user data is correct', async () => {
        const newUser = { nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01"};
        const mockCreatedUser = { id: 1, ...newUser };

        mockingoose(User).toReturn(mockCreatedUser, 'save');

        const createdUser = await userService.createUser(newUser);

        expect(createdUser).toBeDefined();
        expect(createdUser.nome).toBe(newUser.nome);
        expect(createdUser.email).toBe(newUser.email);
    })

    it ('should raise MissingKeyError if required data is missing', async () => {
        const newUser = { nome: "João das Neves", password: "123", dataNascimento: "2000-01-01"};

        const missingKeyError = new MissingKeyError("email", "email é um campo obrigatório")
        mockingoose(User).toReturn(missingKeyError, 'save');

        await expect(userService.createUser(newUser)).rejects.toThrow("email é um campo obrigatório");
    })

    it ('should raise DuplicateKeyError if email is already used', async () => {
        const newUser = { nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01"};

        const duplicateKeyError = new DuplicateKeyError("email", "email já está em uso");

        mockingoose(User).toReturn(duplicateKeyError, 'save');

        await expect(userService.createUser(newUser)).rejects.toThrow(DuplicateKeyError);
        await expect(userService.createUser(newUser)).rejects.toThrow("email já está em uso");
    })

    it ('should throw on internal server error', async () => {
        const newUser = { nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01"};

        const duplicateKeyError = new Error("erro inesperado");

        mockingoose(User).toReturn(duplicateKeyError, 'save');

        await expect(userService.createUser(newUser)).rejects.toThrow("erro inesperado");
    })
})

describe("userService.updateUser", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should update a user if data is provided correctly", async () => {
        const userId = "65a1234567890abcde123456";
        const updateData = { nome: "Biruleibe", email: "biruleibe@email.com"};
        const userBefore = { id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
        const savedUser = { id: userId, nome: "Biruleibe", email: "biruleibe@email.com", password: "123", dataNascimento: "2000-01-01" };

        mockingoose(User).toReturn(userBefore, 'findOne');
        mockingoose(User).toReturn(savedUser, 'save');

        const updatedUser = await userService.updateUser(userId, updateData);

        expect(updatedUser).toBeDefined();
        expect(updatedUser.nome).toEqual(updateData.nome);
        expect(updatedUser.email).toEqual(updateData.email);
    })

    it("should raise DuplicateKeyError if trying to update to an used email", async () => {
        const userId = "65a1234567890abcde123456";
        const updateData = { nome: "Biruleibe", email: "biruleibe@email.com"};
        const userBefore = { id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
        const duplicateKeyError = new DuplicateKeyError("email", "email já está em uso");

        mockingoose(User).toReturn(userBefore, 'findOne');
        mockingoose(User).toReturn(duplicateKeyError, 'save');

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow(DuplicateKeyError);
        await expect(userService.updateUser(userId, updateData)).rejects.toThrow("email já está em uso");
    })

    it("should raise error if user is not found on update", async () => {
        const userId = "65a1234567890abcde123456";
        const updateData = { nome: "Biruleibe", email: "biruleibe@email.com"};

        mockingoose(User).toReturn(null, 'findOne');

        await expect(userService.updateUser(userId, updateData)).rejects.toThrow("Usuário não encontrado");
    })
})

describe ("userService.findUser", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should find user if correct id is provided", async () => {
        const userId = "65a1234567890abcde123456";
        const foundUser = { id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };

        mockingoose(User).toReturn(foundUser, 'findOne');

        const user = await userService.findUser(userId);

        expect(user).toBeDefined();
        expect(user.nome).toEqual(foundUser.nome);
        expect(user.email).toEqual(foundUser.email);
    })

    it("should raise error if user not found", async () => {
        const userId = "65a1234567890abcde123456";
        mockingoose(User).toReturn(null, 'findOne');

        await expect(userService.findUser(userId)).rejects.toThrow("Usuário não encontrado");
    })
})

describe ("userService.deleteUser", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should delete user if correct id is provided and no character was deleted", async () => {
        const userId = "65a1234567890abcde123456";
        const mockUser = { id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };

        mockingoose(Character).toReturn({ acknowledge: true, deletedCount: 0 }, 'deleteMany')
        mockingoose(User).toReturn(mockUser, 'findOneAndDelete');

        const user = await userService.deleteUser(userId);

        expect(user).toBeDefined();
        expect(user.nome).toEqual(mockUser.nome);
        expect(user.email).toEqual(mockUser.email);
    })

    it("should delete user if correct id is provided and characters were deleted", async () => {
        const userId = "65a1234567890abcde123456";
        const mockUser = { id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };

        mockingoose(Character).toReturn({ acknowledge: true, deletedCount: 3 }, 'deleteMany')
        mockingoose(User).toReturn(mockUser, 'findOneAndDelete');

        const user = await userService.deleteUser(userId);

        expect(user).toBeDefined();
        expect(user.nome).toEqual(mockUser.nome);
        expect(user.email).toEqual(mockUser.email);
    })

    it("should raise error if user not found", async () => {
        const userId = "65a1234567890abcde123456";
        mockingoose(Character).toReturn({ acknowledge: true, deletedCount: 0 }, 'deleteMany')
        mockingoose(User).toReturn(null, 'findOne');

        await expect(userService.deleteUser(userId)).rejects.toThrow("Usuário não encontrado");
    })
})