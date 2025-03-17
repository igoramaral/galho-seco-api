const authService = require('../services/authService');

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ error: "Email e Senha são obrigatórios" });
    }

    try {
        const login = await authService.login(email, password);

        res.status(200).json({ token: login.token, user: login.user });
    } catch (err) {
        if(err.message === 'Usuário não encontrado' || err.message === "Senha incorreta"){
            res.status(401).json({ error: err.message })
        } else{
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" })
        } 
    }
}



module.exports = {
    login
}