import { usersService, cartsService } from "../service/index.js";
import usersDTO from "../dao/DTOs/user.dto.js";
import { createHash } from "../utils.js";

export const getUsers = async (req, res) => {
    try{
        let users = await usersService.getUsers();
        res.send({result: "success", payload: users});
    }catch(error){
        console.log(error);
    }
}

export const getUserById = async (req, res) => {
    try{
        let id = req.params.id;
        let user = await usersService.findUserById(id);
        res.send({result: "success", payload: user});
    }catch(error){
        console.log(error);
    }
}

export const createUser = async (req, res) => {
    let newUser;
    let result
    try{
        let user = req.body;
        let userdto = new usersDTO(user.first_name, user.last_name, user.email, user.password, user.age);
        let hashedPassword = createHash(user.password);
        userdto.password = hashedPassword;

        if (!userdto.isAdmin) {
            let cart = await cartsService.createCart({});
            newUser = { ...userdto, cartId: cart._id };
            result = await usersService.createUser(newUser);
            cart.userId = result._id;
            await cartsService.updateCart(cart._id, cart);
            res.send({result: "success", payload: result});
            return;
        }
        result = await usersService.createUser(userdto);
        res.send({result: "success", payload: result});
    }catch(error){
        console.log(error);
    }
}

export const userToAdmin = async (req, res) => {
    try{
        let id = req.params.id;
        let user = await usersService.findUserById(id);
        if (user.isAdmin){
            user.isAdmin = false;
        }else{
            user.isAdmin = true;
        }

        let updatedUser = await usersService.updateUser(id, user);
        res.send({result: "success", payload: user});

    }catch(error){
        console.log(error);
    }
}