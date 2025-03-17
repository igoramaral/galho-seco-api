const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

        //generates Access Token
        const token = jwt.sign(
            { userId: user._id },  
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }     
        );

        //generates Refresh Token
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

        //saves Refresh Token to user
        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        const response = {
            token: token,
            refreshToken: refreshToken,
            user: userObject
        }
        return response
    }

    async refreshAccessToken(refreshToken){
        const user = await User.findOne({ refreshToken });

        if (!user || !user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
            throw new Error("Refresh Token expirado ou inválido");
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },  
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        //generates a new Refresh Token
        const newRefreshToken = crypto.randomBytes(40).toString('hex');
        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

        //saves Refresh Token to user
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        await user.save();
    
        return({ token: newAccessToken, refreshToken: newRefreshToken });
    }

    async logout(userId) {
        
        const user = await User.findOneAndUpdate({ _id: userId}, { refreshToken: null, refreshTokenExpiresAt: null });

        if (user != null){
            return user
        } else {
            throw new Error("Usuário não encontrado");
        }
    }
}

module.exports = new AuthService();