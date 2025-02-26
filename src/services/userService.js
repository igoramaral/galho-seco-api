const DuplicateKeyError = require('../errors/duplicatedKeyError');
const User = require('../models/user');
const Character = require('../models/character');
const crypto = require('crypto');

class UserService {

    async createUser(userData) {

        let verificationToken = crypto.randomBytes(32).toString('hex');
        userData.verificationToken = verificationToken;

        let user = new User(userData);

        try{
            await user.save()
                .then((result) => {
                    user = result;
                })                
        } catch (err){
            if (err instanceof DuplicateKeyError){
                console.error("UserService::createUser - ", err.message)
            } else {
                console.error("UserService::updateUser - ", err)
            }
            
            throw(err);
        }

        console.log(`UserService::createUser - User ${user._id} - ${user.email} created successfully`);
        return user;
    }

    async getAllUsers(){
        return User.find()
    }

    async findUser(userId){
        let user = await User.findById(userId, "-password")
        if (user != null){
            console.log(`UserService::findUser - User with id ${userId} found successfully`);
            return user
        } else {
            console.error(`UserService::findUser - User with id ${userId} not found`);
            throw new Error("Usuário não encontrado")
        }        
    }

    async updateUser(userId, userData){
        try {
            let user = await User.findById(userId);

            if (!user) {
                throw new Error("Usuário não encontrado");
            }
            
            Object.assign(user, userData);
            user = await user.save();

            console.log(`UserService::updateUser - User ${userId} updated successfully`);
            return user;
        } catch(err){
            if (err instanceof DuplicateKeyError){
                console.error(`UserService::updateUser - ${err.name}: ${err.message}`);
            } else {
                console.error("UserService::updateUser - ", err)
            }
            
            throw err;
        }
    }

    async deleteUser(userId){
        try {

            const charDelete = await Character.deleteMany({ userId });
            if (charDelete.deletedCount === 0){
                console.log(`UserService::deleteUser - user ${userId} has no characters to be deleted`)
            } else {
                console.log(`UserService::deleteUser - ${charDelete.deletedCount} characters of user ${userId} deleted successfully`)
            }
            
            const deletedUser = await User.findByIdAndDelete(userId);
        
            if (!deletedUser) {
              throw new Error("Usuário não encontrado");
            }
        
            console.log(`UserService::deleteUser - User ${userId} deleted successfully`);
            return deletedUser;
        } catch (error) {
        console.error("UserService::deleteUser - ", error);
        throw error;
        }
    }
}

module.exports = new UserService();