const userService = require('../../services/userService');
const User =  require('../../models/user');
const mockingoose = require('mockingoose');
const { isObjectIdOrHexString } = require('mongoose');
const DuplicateKeyError = require('../../errors/duplicatedKeyError');

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

describe("Create User", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it ('should create user if user data is correct', async () => {
        const newUser = { nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01"};
        const mockCreatedUser = { _id: 1, ...newUser };

        mockingoose(User).toReturn(mockCreatedUser, 'save');

        const createdUser = await userService.createUser(newUser);

        expect(createdUser).toBeDefined();
        expect(createdUser.nome).toBe(newUser.nome);
        expect(createdUser.email).toBe(newUser.email);
    })

    it ('should not create user if required data is missing', async () => {
        const newUser = { nome: "João das Neves", password: "123", dataNascimento: "2000-01-01"};

        mockingoose(User).toReturn(new Error("Path `email` is required."), 'save');

        await expect(userService.createUser(newUser)).rejects.toThrow("Path `email` is required.");
    })

    it ('should raise DuplicateKeyError if email is already used', async () => {
        const newUser = { nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01"};

        const duplicateKeyError = new DuplicateKeyError("email", "email já está em uso");

        mockingoose(User).toReturn(duplicateKeyError, 'save');

        await expect(userService.createUser(newUser)).rejects.toThrow(DuplicateKeyError);
        await expect(userService.createUser(newUser)).rejects.toThrow("email já está em uso");
    })
})

describe("Update user", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should update a user if data is provided correctly", async () => {
        const userId = "65a1234567890abcde123456";;
        const updateData = { nome: "Biruleibe", email: "biruleibe@email.com"};
        const userBefore = { _id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
        const savedUser = { _id: userId, nome: "Biruleibe", email: "biruleibe@email.com", password: "123", dataNascimento: "2000-01-01" };

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
        const userBefore = { _id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };
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

describe ("find user", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should find user if correct id is provided", async () => {
        const userId = "65a1234567890abcde123456";
        const foundUser = { _id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };

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

describe ("delete user", () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it("should delete user if correct id is provided", async () => {
        const userId = "65a1234567890abcde123456";
        const mockUser = { _id: userId, nome: "João das Neves", email: "test@email.com", password: "123", dataNascimento: "2000-01-01" };

        mockingoose(User).toReturn(mockUser, 'findOneAndDelete');

        const user = await userService.deleteUser(userId);

        expect(user).toBeDefined();
        expect(user.nome).toEqual(mockUser.nome);
        expect(user.email).toEqual(mockUser.email);;
    })

    it("should raise error if user not found", async () => {
        const userId = "65a1234567890abcde123456";
        mockingoose(User).toReturn(null, 'findOne');

        await expect(userService.deleteUser(userId)).rejects.toThrow("Usuário não encontrado");
    })
})