const { response } = require('express');
const authService = require('../services/authService');

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ error: "Email e Senha são obrigatórios" });
    }

    try {
        const login = await authService.login(email, password);

        res.status(200).json({ token: login.token, refreshToken:login.refreshToken, user: login.user });
    } catch (err) {
        if(err.message === 'Usuário não encontrado' || err.message === "Senha incorreta"){
            res.status(401).json({ error: err.message })
        } else{
            console.error("AuthController::login - Error: ", err);
            res.status(500).json({ error: "Internal Server Error" })
        } 
    }
}

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken){
        return res.status(400).json({ error: "Refresh Token é obrigatório" });
    }

    try{
        const response = await authService.refreshAccessToken(refreshToken);

        res.status(200).json({ token: response.token, refreshToken: response.refreshToken});
    } catch (err){
        if (err.message == "Refresh Token expirado ou inválido"){
            console.error("AuthController::refreshAccessToken - Error: ", err.message);
            return res.status(401).json({ error: err.message });
        } else {
            console.error("AuthController::refreshAccessToken - Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const logout = async (req, res) => {
    try {

        const userId = req.userId;

        await authService.logout(userId);

        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        if (err.message == 'Usuário não encontrado') {
            console.error("AuthController::logout - Error: ", err.message);
            res.status(404).json({ error: err.message });
        } else {
            console.error("AuthController::logout - Error: ", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.userId;

        const { password, newPassword } = req.body;
        if (!password || !newPassword){
            return res.status(400).json({ error: !password ? "Informe sua senha" : "Informe sua nova senha" });
        }

        let response = await authService.updatePassword(userId, password, newPassword);
        res.status(200).json(response);
    } catch (err) {
        if (err.message == 'Usuário não encontrado' || err.message == 'Senha incorreta') {
            console.error("AuthController::changePassword - Error: ", err.message);
            res.status(401).json({ error: err.message });
        } else {
            console.error("AuthController::changePassword - Error: ", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = {
    login,
    refreshAccessToken,
    logout,
    changePassword
}