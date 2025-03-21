const DuplicateKeyError = require('../errors/duplicatedKeyError');
const MissingKeyError = require('../errors/missingKeyError');
const User = require('../models/user');
const Character = require('../models/character');
const crypto = require('crypto');

class UserService {

    async createUser(userData) {

        let verificationToken = crypto.randomBytes(32).toString('hex');
        userData.verificationToken = verificationToken;

        let user = null
        try{
            user = new User(userData);
        
            await user.save()
                .then((result) => {
                    user = result.toObject();
                    delete user.password;
                })                
        } catch (err){
            if (err instanceof DuplicateKeyError || err instanceof MissingKeyError){
                console.error("UserService::createUser - ", err.message)
            } else {
                console.error("UserService::createUser - ", err)
            }
            
            throw(err);
        }

        console.log(`UserService::createUser - User ${user.id} - ${user.email} created successfully`);
        return user;
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

            const userObject = user.toObject()
            delete userObject.password;
            return userObject;
        } catch(err){
            if (err instanceof DuplicateKeyError || err instanceof MissingKeyError){
                console.error(`UserService::updateUser - ${err.name}: ${err.message}`);
            } else {
                console.error("UserService::updateUser - ", err)
            }
            
            throw err;
        }
    }

    async deleteUser(userId){
        try {

            const charDelete = await Character.deleteMany({ user: userId });
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