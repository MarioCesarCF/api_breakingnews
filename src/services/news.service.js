import News from "../models/News.js";

export const createService = (body) => News.create(body);

export const findAllService = (offset, limit) =>
  News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

export const countNews = () => News.countDocuments();

export const topNewsService = () =>
  News.findOne().sort({ _id: -1 }).populate("user");

export const findNewsByIdService = (id) => News.findById(id).populate("user");

export const searchByTitleService = (title) =>
  News.find({
    title: { $regex: `${title || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

export const byUserService = (id) =>
  News.find({ user: id }).sort({ _id: -1 }).populate("user");
/*OBS: ao usar o export default para objetos (desconstruido) é necessário importar como um objeto e depois usar .createService (exemplo). Para corrigir isso optou-se por retirar o default, tanto no Service quanto no Controller*/

export const updateService = (id, title, text, banner) =>
  News.findOneAndUpdate(
    { _id: id },
    { title, text, banner },
    { rawResult: true }
  ).populate("user");

export const deleteService = (id) => News.findOneAndDelete({ _id: id });

/*Aula 28 - Não ficou muito claro este filtro, mas a ideia é que faça verificação se no array de likes já tem like nessa news que foi dado pelo userId que está tentando dar o like nesse momento.
Essa parte de colocar e retirar itens de um array no banco de dados é bem interessante.
LEMBRAR DE VER ESSE VÍDEO NOVAMENTE
*/
export const likeNewsService = (idNews, userId) =>
  News.findOneAndUpdate(
    { _id: idNews, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: new Date() } } }
  );

export const deleteLikeNewsService = (idNews, userId) =>
  News.findOneAndUpdate({ _id: idNews }, { $pull: { likes: { userId } } });

export const addCommentNewsService = (idNews, comment, userId) => {
  const idComment = Math.floor(Date.now() * Math.random()).toString(36);
  return News.findOneAndUpdate(
    { _id: idNews },
    { $push: { comments: { idComment, comment, userId, created: new Date() } } }
  );
};

export const removeCommentNewsService = (idNews, idComment, userId) =>
  News.findOneAndUpdate(
    { _id: idNews },
    { $pull: { comments: { idComment, userId } } }
  );
