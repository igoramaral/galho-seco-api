const characterController = require('../../controllers/characterController');
const characterService = require('../../services/characterService');
const MissingKeyError = require('../../errors/missingKeyError');

jest.mock('../../services/characterService');

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

describe('characterController.createCharacter', () => {

    let req, res;

    beforeEach(()=>{
        req = {
            userId: "65d5a7f2e7b3a3c4f4b9d5e1",
            body: { 
                name: "Bruenor", 
                system: {
                    str: {
                        value: 12,
                        proficient: 0
                    },
                    cha: {
                        value: 16,
                        proficient: 1
                    }
                }
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it("Should return 201 and created char when data correct", async() => {
        let mockChar = { _id: '65a1234567890abcde123456', user: req.userId, ...req.body };

        characterService.createCharacter.mockResolvedValue(mockChar);

        await characterController.createCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockChar);
    })

    it("Should return 500 on MissingKeyError (no name provided)", async() => {
        characterService.createCharacter.mockRejectedValue(new MissingKeyError("name", "name é um campo obrigatório"));

        await characterController.createCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    })

    it("Should return 500 on internal error", async () => {
        characterService.createCharacter.mockRejectedValue(new Error());
        
        await characterController.createCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe('characterController.findCharacter', () => {
    let req, res;

    beforeEach(()=>{
        req = {
            userId: "65d5a7f2e7b3a3c4f4b9d5e1",
            params:{
                id: '65a1234567890abcde123456'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return 200 Ok and character when successful', async () => {
        let mockChar = { 
            _id: '65a1234567890abcde123456', 
            user: req.userId, 
            name: "Bruenor", 
            system: {
                str: {
                    value: 12,
                    proficient: 0
                },
                cha: {
                    value: 16,
                    proficient: 1
                }
            }
        }

        characterService.findCharacter.mockResolvedValue(mockChar);

        await characterController.findCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockChar);
    })

    it('should return 404 when character not found', async () => {
        characterService.findCharacter.mockRejectedValue(new Error("Personagem não encontrado"));

        await characterController.findCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Personagem não encontrado"});
    })

    it("Should return 500 on internal error", async () => {
        characterService.findCharacter.mockRejectedValue(new Error());
        
        await characterController.findCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe('characterController.getAllCharacters', () => {
    let req, res;

    beforeEach(()=>{
        req = {
            userId: "65d5a7f2e7b3a3c4f4b9d5e1",
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it("should return a list of characters", async ()=>{
        let charlist = [
            {
                name: "Bruenor",
                id: "1234",
                user: "65d5a7f2e7b3a3c4f4b9d5e1"
            },
            {
                name: "Drizzt",
                id: "2345",
                user: "65d5a7f2e7b3a3c4f4b9d5e1"
            }
        ]
        characterService.getAllCharacters.mockResolvedValue(charlist);

        await characterController.getAllCharacters(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(charlist);
    })

    it("should throw error in case of internal server error", async () => {
        characterService.getAllCharacters.mockRejectedValue(new Error());

        await characterController.getAllCharacters(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe('characterController.updateCharacter', () => {
    let req, res;

    beforeEach(()=>{
        req = {
            userId: "65d5a7f2e7b3a3c4f4b9d5e1",
            params:{
                id: '65a1234567890abcde123456'
            },
            body: {
                name: "Bruenor", 
                system: {
                    str: {
                        value: 12,
                        proficient: 0
                    },
                    cha: {
                        value: 16,
                        proficient: 1
                    }
                }
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return 200 Ok and updated character when successful', async () => {
        let mockChar = req.body

        characterService.updateCharacter.mockResolvedValue(mockChar);

        await characterController.updateCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockChar);
    });

    it('should return 404 when character not found', async () => {
        characterService.updateCharacter.mockRejectedValue(new Error("Personagem não encontrado"));

        await characterController.updateCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Personagem não encontrado"});
    })

    it('should return 400 when trying to nullify required field', async () => {
        characterService.updateCharacter.mockRejectedValue(new MissingKeyError("name", "name é um campo obrigatório"));

        await characterController.updateCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(400);
    })

    it("Should return 500 on internal error", async () => {
        characterService.updateCharacter.mockRejectedValue(new Error());
        
        await characterController.updateCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe('characterController.deleteUser', () => {
    let req, res;

    beforeEach(()=>{
        req = {
            userId: "65d5a7f2e7b3a3c4f4b9d5e1",
            params:{
                id: '65a1234567890abcde123456'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return 200 Ok and character when successful', async () => {
        let mockChar = { 
            _id: '65a1234567890abcde123456', 
            user: req.userId, 
            name: "Bruenor", 
            system: {
                str: {
                    value: 12,
                    proficient: 0
                },
                cha: {
                    value: 16,
                    proficient: 1
                }
            }
        }

        characterService.deleteCharacter.mockResolvedValue(mockChar);

        await characterController.deleteCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Personagem excluído com sucesso"});
    })

    it('should return 404 when character not found', async () => {
        characterService.deleteCharacter.mockRejectedValue(new Error("Personagem não encontrado"));

        await characterController.deleteCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Personagem não encontrado"});
    })

    it("Should return 500 on internal error", async () => {
        characterService.deleteCharacter.mockRejectedValue(new Error());
        
        await characterController.deleteCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})