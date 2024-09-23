import { usersService } from "../service/index.js";
import nodemailer from 'nodemailer';
import { generateToken, createHash , isValidPassword} from '../utils.js';
import bcrypt from 'bcrypt';

export const lalala = async (req, res) => {
    res.render('verificacionMail')
}

export const verificacionMail = async (req, res) => {
    const {email} = req.body;
    const {url} = req.body
    try{
        let UserExist = await usersService.findUser(email);
        if (!UserExist){
            return res.status(404).render('deniedResponse', {status:'El mail no esta Registrado',message: "Porfavor registrese primero", callback: '/reestablecimientoCont/'});
        }
        
        let token = generateToken(email);

        const transport = nodemailer.createTransport({
            service: 'gmail',
            port:587, 
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        })

        let result = await transport.sendMail({
            from: process.env.MAIL,
            to: email, 
            subject: `Recibimos un intento de cambio de contraseña`,
            html: `
            <div>
                <h1> ${UserExist.first_name}, Hemos recibido uintento de cambio de contraseña \n </h1>
                <h3> Has click en el link de abajo para poder reestablecer tu contraseña \n En caso de que no hayas hecho tal petición, te pedimos que ignores ste mensaje. </h3>
                <a method="post" href="${url}/reestablecimientoCont/verificado/${token}"> Click aquí para reestablecer tu contraseña </a>
                </div>
            `,
        })

        req.user = UserExist;
        res.send({message:'Se ha enviado un mail a tu casilla de correo para reestablecer tu contraseña'});


    }catch(error){
        console.log(error);
        res.render('deniedResponse', {status:'Verificacion no Exitosa ',message: "No se puedo enviar el correo electronico para reestablecer tu contraseña,. Poravor Intente más Tarde", callback: '/'});
    }
}

export const verificarToken = (req, res) => {
    res.render('resCont', {token: req.params.token});
}

export const reestablecerContraseña = async (req, res) => {
    let {password, password2} = req.body;
    try {
        let user = req.user;

        if (!password || !user.password) {
            return res.status(400).render('deniedResponse', {
                status: 'Datos incompletos',
                message: 'Por favor, proporciona todos los datos necesarios.', 
                callback: '/'
            });
        }

        if (isValidPassword(user, password)) {
            return res.status(404).render('deniedResponse', {
                status: 'Contraseña no Cambiada',
                message: 'No puedes utilizar la misma contraseña.', 
                callback: '/'
            });
        }

        if (password !== password2) {
            return res.status(404).render('deniedResponse', {
                status: 'Contraseñas no Coinciden',
                message: 'Por favor, verifica que las contraseñas coincidan.', 
                callback: '/'
            });
        }

        user.password = createHash(password);
        let result = await usersService.updateUser(user._id, user);
        res.render('successResponse', {
            status: 'Reestablecimiento de Contraseña Exitoso',
            message: 'Tu contraseña ha sido reestablecida con éxito.', 
            callback: '/'
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('deniedResponse', {
            status: 'Reestablecimiento de Contraseña no Exitoso',
            message: 'No se pudo reestablecer tu contraseña. Por favor, intenta más tarde.'
        });
    }
}