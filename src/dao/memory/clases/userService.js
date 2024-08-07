export default class Users{

    constructor() {
        this.data = [];
    }

    getUsers = async () => {
        try {
            return this.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    findUser = async (username) => {
        try {
            let result = this.data.find(user => user.email === username);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    createUser = async (user) => {
        try {
            let id = this.data.length + 1;
            this.data.push({_id:id, ...user });
            let result = this.findUserById(id);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    findUserById = async (id) => {
        try {
            let result = this.data.find(user => user._id === id);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    updateUser = async (id, user) => {
        try {
            let index = this.data.findIndex(user => user._id === id);
            this.data[index] = {...this.data[index], ...user};
            let result = this.findUserById(id);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

}