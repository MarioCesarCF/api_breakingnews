import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js"

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.send(401);
    }

    //dividindo as partes do headers 'Bearer' e 'token'
    const parts = authorization.split(" ");

    if (parts.length !== 2) {
      return res.send(401);
    }

    //fazendo a destruturação do array parts
    const [schema, token] = parts;

    if (schema !== "Bearer") {
      return res.status(401).send({ message: " Word Bearer not found in headers." });
    }

    jwt.verify(token, process.env.KEY_TOKEN, async (error, decoded) => {
      if (error) {
        return res.status(401).send({message: "Token invalid!"});
      }
      
      const user = await userService.findByIdService(decoded.id);

      if (!user || !user.id) {
        return res.status(400).send({ mensage: "Token invalid!" });
      }

      req.userId = user.id;

      //Lembrar de colocar o next() dentro da função.
      return next();
    });    
  } catch (err) {
    res.status(500).send(err.message);
  }
};
