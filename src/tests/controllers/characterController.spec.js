const characterController = require('../../controllers/characterController');
const characterService = require('../../services/characterService');

jest.mock('../../services/characterService');

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

    it("Should return 500 on internal error", async () => {
        characterService.createCharacter.mockRejectedValue(new Error());
        
        await characterController.createCharacter(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    })
})

describe('characterController.findUser', () => {
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

describe('characterController.updateUser', () => {
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
    })

    it('should return 404 when character not found', async () => {
        characterService.updateCharacter.mockRejectedValue(new Error("Personagem não encontrado"));

        await characterController.updateCharacter(req, res)

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Personagem não encontrado"});
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