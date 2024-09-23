import { verifyToken } from "../utils.js";
import { usersService } from "../service/index.js";

export const veryfyTokenMiddleware = async (req, res, next) => {
    const token = req.params.token;

    try{
        const decode = verifyToken(token);
        if (!decode){
            return res.status(404).render('deniedResponse', {status:'Token Invalido',message: "Porfavor intente nuevamente", 
                callback: '/'});
        }

        const user = await usersService.findUser(decode.email);
        if (!user){
            return res.status(404).render('deniedResponse', {status:'Usuario no encontrado',message: "Porfavor intente nuevamente", 
                callback: '/'});
        }

        req.user = user;

        next();

    }catch(error){
        console.log(error);
        res.status(404).render('deniedResponse', {status:'Token Invalido',message: "Porfavor intente nuevamente", 
            callback: '/'});
    }
}