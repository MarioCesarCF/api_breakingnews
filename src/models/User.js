import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  avatar: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
});

UserSchema.pre("save", async function (next) {
  //hash é a função dentro do bcrypt que faz a transformação da string da senha em uma string aleatória, o primeiro parâmetro é a string da senha e o segundo é quantas rodadas ele vai dar transformando os caracteres.
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

const User = mongoose.model("User", UserSchema);

export default User;