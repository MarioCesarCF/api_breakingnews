import { Router } from 'express';
const router = Router();

//import do login desestruturado por só ter uma função no arquivo controller, ai fica mais legível
import { login } from '../controllers/auth.controller.js'

router.post('/', login);

export default router;