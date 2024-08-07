import { Router } from "express";
import { veryfyTokenMiddleware } from "../../middlewares/mailToken.js";
import {verificacionMail, reestablecerContraseña, lalala, verificarToken} from "../../controllers/reesCont.js"

const router = Router();

router.get('/', lalala);

router.get('/verificado/:token',veryfyTokenMiddleware , verificarToken);

router.post('/verificado/:token',veryfyTokenMiddleware, reestablecerContraseña)

router.post('/lalala',verificacionMail )

export default router;

