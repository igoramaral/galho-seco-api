const DuplicateKeyError = require('../errors/duplicatedKeyError');
const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        if(err instanceof DuplicateKeyError) {
            res.status(err.statusCode).json({ 
                error: err.name,
                field: err.field,
                message: err.message
             });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    if( userId !== id){
        return res.status(403).json({ error: "Você não tem permissão para obter outro perfil" });
    }

    try {
        const user = await userService.findUser(id);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: "Usuário não encontrado" });
    }     
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const userData = req.body;

        if( userId !== id){
            return res.status(403).json({ error: "Você não tem permissão para editar outro perfil" });
        }

        const user = await userService.updateUser(id, userData);

        res.status(200).json(user);
    } catch (err){
        if (err.message == "Usuário não encontrado" ){
           res.status(404).json({ error: "Usuário não encontrado" });
        } else if (err instanceof DuplicateKeyError) {
            res.status(err.statusCode).json({ 
                error: err.name,
                field: err.field,
                message: err.message
             });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if( userId !== id){
            return res.status(403).json({ error: "Você não tem permissão para deletar outro perfil" });
        }

        const user = await userService.deleteUser(id);

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (err){
        if (err.message == "Usuário não encontrado"){
            return res.status(404).json({ error: "Usuário não encontrado" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}