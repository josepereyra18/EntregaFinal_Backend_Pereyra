import User from '../models/user.model.js';
export default class Users {
        constructor() {

        }

        getUsers = async () => {
                let result = await User.find();
                return result
        }

        findUser = async (username) => {
                let result = await User.findOne({ email: username });
                return result
        }

        createUser = async (user) => {
                let result = await User.create(user);
                return result
        }

        findUserById = async (id) => {
                let result = await User.findById(id);
                return result
        }

        updateUser = async (id, user) => {
                let result = await User.findByIdAndUpdate(id, user);
                return result
        }

        deleteUser = async (id) => {
                let result = await User.deleteOne({ _id: id });
                return result
        }

}