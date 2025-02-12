const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

    const user = await userService.findUser(id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: "Usuário não encontrado" });
    }       
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body

        const user = await userService.updateUser(id, userData);

        res.status(200).json(user);
    } catch (err){
        if (err.message == "Usuário não encontrado"){
           res.status(404).json({ error: "Usuário não encontrado" });
        } else {
            res.status(500).json({ error: "Error - " + err.message });
        }
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.deleteUser(id);

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (err){
        if (err.message == "Usuário não encontrado"){
            return res.status(404).json({ error: "Usuário não encontrado" });
        } else {
            return res.status(500).json({ error: "Error - " + err.message });
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