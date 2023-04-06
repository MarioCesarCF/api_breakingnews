import { Router } from "express";
const router = Router();

import {
  create,
  findAll,
  findNewsById,
  topNews,
  searchByTitle,
  byUser,
} from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post('/', authMiddleware, create);
router.get('/', findAll);
router.get('/top', topNews);
router.get('/search', searchByTitle);
router.get("/byUser", authMiddleware, byUser);

//A rota get com :id deve ficar abaixo das demais para não causar interferencia. Problema do Express
router.get("/:id", authMiddleware, findNewsById);

export default router;