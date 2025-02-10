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
            throw(err);
        }

        return user;
    }

    async getAllUsers(){
        return User.find()
    }
}

module.exports = new UserService();