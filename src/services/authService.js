const User = require('../models/user');
const jwt = require('jsonwebtoken');

class AuthService {

    async login(email, password){
        // Check if user exists
        const user = await User.findOne({ email })
            .select("-isVerified -verificationToken -__v");
            
        
        if (!user) {
            throw new Error("Usuário não encontrado"); 
        }

        const isPasswordValid = await user.checkPassword(password);

        if (!isPasswordValid) {
            throw new Error("Senha incorreta");
        }

        const token = jwt.sign(
            { userId: user._id },  
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }     
        );

        const userObject = user.toObject();
        delete userObject.password;

        const response = {
            token: token,
            user: userObject
        }
        return response
    }
}

module.exports = new AuthService();