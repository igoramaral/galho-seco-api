const DuplicateKeyError = require('../errors/duplicatedKeyError');
const user = require('../models/user');
const User = require('../models/user');

class UserService {

    async createUser(userData) {

        let user = new User(userData);

        try{
            await user.save()
                .then((result) => {
                    user = result;
                })                
        } catch (err){
            if (err instanceof DuplicateKeyError){
                console.log("UserService::createUser - ", err.message)
            } else {
                console.log("UserService::updateUser - ", err)
            }
            
            throw(err);
        }

        console.log(`UserService::createUser - User ${user._id} - ${$user.email} created successfully`);
        return user;
    }

    async getAllUsers(){
        return User.find()
    }

    async findUser(userId){
        let user = await User.findById(userId)
        if (user != null){
            console.log(`UserService::findUser - User with id ${userId} found successfully`);
            return user
        } else {
            console.log(`UserService::findUser - User with id ${userId} not found`);
            return null
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
                console.log(`UserService::updateUser - ${err.name}: ${err.message}`);
            } else {
                console.log("UserService::updateUser - ", err)
            }
            
            throw err;
        }
    }

    async deleteUser(userId){
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
        
            if (!deletedUser) {
              throw new Error("Usuário não encontrado");
            }
        
            console.log(`UserService::deleteUser - User ${userId} created successfully`);
            return deletedUser;
          } catch (error) {
            console.error("UserService::deleteUser - ", error);
            throw error;
          }
    }
}

module.exports = new UserService();