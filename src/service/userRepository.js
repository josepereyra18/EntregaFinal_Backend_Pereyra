export default class usersRepository {
    constructor(dao) {
        this.dao = dao;
    }


    getUsers = async () => {
        let result = await this.dao.getUsers();
        return result;
    }

    findUser = async (username)=>{
        let result = await this.dao.findUser(username);
        return result;
    }

    createUser = async (user) => {
        let result = await this.dao.createUser(user);
        return result
    }
    
    findUserById = async (id) => {
        let result = await this.dao.findUserById(id);
        return result
    }

    updateUser = async (id, user) => {
        let result = await this.dao.updateUser(id, user);
        return result
    }

    deleteUser = async (id) => {
        let result = await this.dao.deleteUser(id);
        return result
}

}