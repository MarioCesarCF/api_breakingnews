import { Router } from 'express';
const router = Router();

import multer from "multer";
import multerConfig from "../config/multer.cjs";

//import do login desestruturado por só ter uma função no arquivo controller, ai fica mais legível
import { login, upload, download }  from '../controllers/auth.controller.js';

router.post('/', login);

//tentativas de upload e download
router.post("/posts", multer(multerConfig).single('file'), upload);
router.get("/download/:id", download);

export default router;