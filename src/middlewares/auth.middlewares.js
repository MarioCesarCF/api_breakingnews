import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const authMiddleware = (req, res, next) => {
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
    return res.send(401);
  }

  jwt.verify(token, process.env.KEY_TOKEN, (error, decoded) => {
    console.log(error);
    console.log(decoded);
  })

  next();
}