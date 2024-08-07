import {cartsService,usersService} from "../service/index.js";
import { createHash, isValidPassword } from '../utils.js';
import usersDTO from '../dao/DTOs/user.dto.js';

class AuthController {
    async register(req, username, password, done) {
        const { first_name, last_name, age, email } = req.body;
        try {
            let newUser;
            let user = await usersService.findUser(username);
            if (user) {
                console.log("El usuario ya existe");
                return done(null, false);
            }
            console.log(`
            first_name: ${first_name}
            last_name: ${last_name}
            email: ${email}
            password: ${password}
            age: ${age}
                `)
            let userDto = new usersDTO(first_name, last_name, email, password, age);
            let createPassword = createHash(userDto.password);
            userDto.password = createPassword

            if (!userDto.isAdmin) {
                let cart = await cartsService.createCart({});
                newUser = { ...userDto, cartId: cart._id };
                let result = await usersService.createUser(newUser);
                cart.userId = result._id;
                await cartsService.updateCart(cart._id, cart);
                return done(null, result);
            }

            let result = await usersService.createUser(userDto);
            return done(null, result);
        } catch (error) {
            return done("Error al registrar el usuario: " + error);
        }
    }

    async login(username, password, done) {
        try {
            const user = await usersService.findUser(username);
            if (!user) {
                console.log("Usuario no encontrado");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done("Error al obtener el usuario: " + error);
        }
    }

    async githubCallback(accessToken, refreshToken, profile, done) {
        try {
            console.log(profile);
            let user = await usersService.findUser(profile._json.email);

            if (!user) {
                let username = profile._json.name;
                let email = profile._json.email;

                let newUser = new usersDTO(username, "", email, "", 18);
                let result = await usersService.createUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
}

export default new AuthController()