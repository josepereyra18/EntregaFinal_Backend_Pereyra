import { usersService, cartsService } from "../service/index.js";
import usersDTO from "../dao/DTOs/user.dto.js";
import { createHash } from "../utils.js";
import moment from "moment";
import nodemailer from 'nodemailer';
import swal from "sweetalert2";

export const getUsers = async (req, res) => {
    try{
        let users = await usersService.getUsers();
        users = users.map(user => {
            let userObj = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            };
            if (user.isAdmin) {
                userObj.isAdmin = 'admin';
            }else{
                userObj.isAdmin = 'user';
            }
            return userObj;
        });
        res.send({result: "success", payload: users });
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
        let id = req.body.ID;
        let user = await usersService.findUserById(id);
        if (user.isAdmin){
            user.isAdmin = false;
        }else{
            user.isAdmin = true;
        }

        let updatedUser = await usersService.updateUser(id, user);
        res.render('successResponse', {status:'Usuario Modificado',message: `el usuario ${updatedUser.first_name} ha sido modificado a ${user.isAdmin ? 'admin' : 'user'}`, callback:'/AdminMod'});

    }catch(error){
        console.log(error);
    }
}

export const deleteUsers = async (req, res) => {
    try{
        let users = await usersService.getUsers();
        let last_connection = moment().subtract(2, 'days');

        const transport = nodemailer.createTransport({
            service: 'gmail',
            port:587, 
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        })

        for (let user of users){
                if (user.last_connection && moment(user.last_connection).isBefore(last_connection)){
                    await usersService.deleteUser(user._id);

                let result = await transport.sendMail({
                    from: process.env.MAIL,
                    to: user.email, 
                    subject: `Estado de cuenta`,
                    html: `
                    <div>
                        <h1> ${user.first_name}, lo sentimos!</h1>
                        <h3> Nos comunicamos con vos para avistarte que tu cuenta hs sido eliminada debido a inactivdad</h3>
                        <br/>
                        <h3> Te recordamos que nuestra politica de inactividad de de dos dias. Si tienes dudas, comnicate con nostgros !</h3>
                        <h4>Gracias por habernos elegirnos!</h4>
                    </div>
                    `,
                })
            }
        }
        res.send({result: "success", payload: "los usuarios han sido eliminados"});
    } catch(error){
        console.log(error);
    }
}


export const deleteUser = async (req, res) => {
    try{
        let id = req.body.ID;
        await usersService.deleteUser(id);
        res.render('successResponse', {status:'Usuario fue eliminado',message: `el usuario con id ${id} ha sido eliminado`, callback:'/AdminMod'});
    }catch(error){
        console.log(error);
    }
}