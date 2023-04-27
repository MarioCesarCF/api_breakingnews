import bcrypt from "bcrypt";
import {
  loginService,
  generateToken,
  uploadService,
  downloadService,
} from "../services/auth.service.js";

// Esses imports e declarações de palavras chave para a AWS foram necessários para o download dos arquivos vindos do bucket
//
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
const bucketName = process.env.BUCKET_AWS;
const region = process.env.AWS_DEFAULT_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
//

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginService(email);

    if (!user) {
      return res.status(404).send({ message: "Invalid email or password." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(404).send({ message: "Invalid email or password." });
    }

    const token = generateToken(user.id);

    res.send({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//tentativas de upload e download
const upload = async (req, res) => {
  try {
    const { originalname: name, size, key, location: url = "" } = req.file;

    const file = { name, size, key, url };

    const post = await uploadService(file);

    return res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const downloadFile = async (req, res) => {
  try {
    //Nessa primeira parte é identificado o arquivo que será baixado
    const { id } = req.params;

    //Diretório de destino de download no corpo da requisição
    const { diretorio } = req.body;

    const post = await downloadService(id);
    const { key } = post;

    //Essa configuração é para usar o path, não estava dando certo de outra forma
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    //OBS: esse pathDoc indica o caminho do diretório onde o documento será salva. 
    //Neste caso foi usada uma pasda dentro do servidor, mas isso deverá ser definido dinamicamente com escolha do usuário.
    const pathDoc = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

    //Essa é a parte que pega as informações da AWS para identificar o arquivo no bucket
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });
    const s3 = new AWS.S3();
    const options = {
      Bucket: bucketName,
      Key: key,
    };

    //Nessa etapa final são usados o createRead e Write para baixar o arquivo, não entendi bem essa parte
    res.attachment(key);
    const fileStream = s3.getObject(options).createReadStream();
    const writeStream = fs.createWriteStream(path.join(diretorio, key));
    fileStream.pipe(writeStream)
      .on('finish', () => {
        return pathDoc;
      });

    console.log(`Downloaded file: ${key}`);
    return res.json({ msg: "Download ok." });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { login, upload, downloadFile };
