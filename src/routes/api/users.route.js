import { Router } from "express";
import { getUsers, getUserById, createUser, userToAdmin, deleteUsers, deleteUser} from "../../controllers/userController.js";

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.post('/premium/', userToAdmin);

router.delete('/', deleteUsers);

router.post('/delete', deleteUser);

export default router;

