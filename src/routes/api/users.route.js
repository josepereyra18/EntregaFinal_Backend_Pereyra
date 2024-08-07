import { Router } from "express";
import { getUsers, getUserById, createUser, userToAdmin} from "../../controllers/userController.js";

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.put('/premium/:id', userToAdmin);

export default router;

