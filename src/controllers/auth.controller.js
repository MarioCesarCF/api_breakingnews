import bcrypt from "bcrypt";
import {
  loginService,
  generateToken,
  uploadService,
  downloadService,
} from "../services/auth.service.js";

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
    console.log(post);
    return res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const download = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await downloadService(id);

    return res.send({ post });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { login, upload, download };
