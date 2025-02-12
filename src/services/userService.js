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
            console.log("UserService::createUser - ", err)
            throw(err);
        }

        return user;
    }

    async getAllUsers(){
        return User.find()
    }

    async findUser(userId){
        let user = User.findById(userId)
        return user ? user : null;        
    }

    async updateUser(userId, userData){
        try {
            let user = await User.findById(userId);

            if (!user) {
                throw new Error("Usuário não encontrado");
            }
            
            Object.assign(user, userData);
            try{
               await user.save()
                    .then((result) => {
                        user = result;
                    })                
            } catch (err){
                console.log("UserService::updateUser - ", err)
                throw(err);
            }

            return user;
        } catch(err){
            console.log("UserService::updateUser - ", err)
            throw err;
        }
    }

    async deleteUser(userId){
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
        
            if (!deletedUser) {
              throw new Error("Usuário não encontrado");
            }
        
            return deletedUser;
          } catch (error) {
            console.error("UserService::deleteUser - ", error);
            throw error;
          }
    }
}

module.exports = new UserService();