import express from 'express';
import { deleteUser, getUsers, signOut, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser); // Atualizar utilizador
router.delete('/delete/:userId', verifyToken, deleteUser); // Apagar utilizador
router.post('/signout', signOut); // Terminar sessão
router.get('/getusers', verifyToken, getUsers); // Obter utilizadores

export default router;
