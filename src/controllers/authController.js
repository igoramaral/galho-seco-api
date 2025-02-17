const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ error: "Email e Senha são obrigatórios" });
    }

    try {

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Usuário não encontrado" }); 
        }

        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
            { userId: user._id },  
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }     
        );

        res.status(200).json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    login
}